import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-page">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retour
        </button>
        <div>
          <h1 class="page-title">{{ isEdit ? 'Modifier le site' : 'Nouveau site' }}</h1>
          <p class="page-subtitle">{{ isEdit ? 'Mettre à jour les données du site' : 'Enregistrer un nouveau site de construction' }}</p>
        </div>
      </div>

      <div class="form-card">
        <form (ngSubmit)="saveSite()">

          <!-- Section: Informations -->
          <div class="form-section">
            <div class="section-label">
              <div class="section-dot"></div>
              <span>Informations du site</span>
            </div>

            <div class="form-group full-width">
              <label>Nom du site <span class="required">*</span></label>
              <input
                type="text"
                [(ngModel)]="site.name"
                name="name"
                required
                placeholder="Ex : Bâtiment A — Tour Nord"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Surface (m²) <span class="required">*</span></label>
                <input
                  type="number"
                  [(ngModel)]="site.surface"
                  name="surface"
                  required
                  step="0.01"
                  placeholder="5000"
                >
              </div>

              <div class="form-group">
                <label>Employés <span class="required">*</span></label>
                <input
                  type="number"
                  [(ngModel)]="site.employees"
                  name="employees"
                  required
                  placeholder="150"
                >
              </div>
            </div>
          </div>

          <!-- Section: Exploitation -->
          <div class="form-section">
            <div class="section-label">
              <div class="section-dot teal"></div>
              <span>Données d'exploitation</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Consommation énergétique (MWh/an) <span class="required">*</span></label>
                <input
                  type="number"
                  [(ngModel)]="site.energyMWh"
                  name="energyMWh"
                  required
                  step="0.1"
                  placeholder="500"
                >
              </div>

              <div class="form-group">
                <label>Places de parking <span class="required">*</span></label>
                <input
                  type="number"
                  [(ngModel)]="site.parkingSpaces"
                  name="parkingSpaces"
                  required
                  placeholder="100"
                >
              </div>
            </div>
          </div>

          <!-- Section: Matériaux -->
          <div class="form-section">
            <div class="section-label">
              <div class="section-dot lime"></div>
              <span>Matériaux de construction (tonnes)</span>
            </div>

            <div class="form-row three-cols">
              <div class="form-group">
                <label>Béton</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    [(ngModel)]="site.concreteTons"
                    name="concreteTons"
                    step="0.1"
                    placeholder="0"
                  >
                  <span class="unit-badge">t</span>
                </div>
              </div>

              <div class="form-group">
                <label>Acier</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    [(ngModel)]="site.steelTons"
                    name="steelTons"
                    step="0.1"
                    placeholder="0"
                  >
                  <span class="unit-badge">t</span>
                </div>
              </div>

              <div class="form-group">
                <label>Verre</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    [(ngModel)]="site.glassTons"
                    name="glassTons"
                    step="0.1"
                    placeholder="0"
                  >
                  <span class="unit-badge">t</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div *ngIf="error" class="alert alert-error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
              <line x1="7" y1="4" x2="7" y2="7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="7" cy="10" r="0.75" fill="currentColor"/>
            </svg>
            {{ error }}
          </div>

          <div *ngIf="success" class="alert alert-success">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4.5 7L6 8.5L9.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ success }}
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="goBack()">Annuler</button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              <span *ngIf="!loading">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 8l3 3 7-7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ isEdit ? 'Mettre à jour' : 'Créer le site' }}
              </span>
              <span *ngIf="loading" class="dots">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
      max-width: 780px;
      margin: 0 auto;
    }

    /* Header */
    .page-header {
      margin-bottom: 28px;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      background: rgba(0, 200, 90, 0.06);
      border: 1px solid rgba(0, 200, 90, 0.14);
      color: var(--muted);
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.15s;
      margin-bottom: 16px;
    }

    .btn-back:hover {
      color: var(--eco-green);
      border-color: rgba(0, 230, 118, 0.3);
      background: rgba(0, 230, 118, 0.08);
    }

    .page-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-bright);
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }

    .page-subtitle {
      color: var(--muted);
      font-size: 13px;
    }

    /* Card */
    .form-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 16px;
      padding: 32px;
      backdrop-filter: blur(12px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    }

    /* Section */
    .form-section {
      margin-bottom: 32px;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 200, 90, 0.08);
    }

    .section-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--eco-green);
      box-shadow: 0 0 6px rgba(0,230,118,0.5);
    }

    .section-dot.teal { background: var(--eco-teal); box-shadow: 0 0 6px rgba(0,191,165,0.5); }
    .section-dot.lime { background: #b2ff59; box-shadow: 0 0 6px rgba(178,255,89,0.5); }

    /* Form items */
    .form-group {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .three-cols {
      grid-template-columns: repeat(3, 1fr);
    }

    label {
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 7px;
    }

    .required {
      color: var(--eco-green);
    }

    input {
      width: 100%;
      padding: 11px 14px;
      background: rgba(0, 20, 10, 0.7);
      border: 1px solid rgba(0, 200, 90, 0.14);
      color: var(--text);
      border-radius: 9px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input::placeholder { color: rgba(77, 122, 92, 0.5); }

    input:focus {
      outline: none;
      border-color: rgba(0, 230, 118, 0.4);
      box-shadow: 0 0 0 3px rgba(0, 230, 118, 0.07);
    }

    .input-with-unit {
      position: relative;
    }

    .input-with-unit input {
      padding-right: 36px;
    }

    .unit-badge {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 11px;
      font-weight: 600;
      color: var(--eco-green);
      pointer-events: none;
    }

    /* Alerts */
    .alert {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 9px;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .alert-error {
      background: rgba(255, 82, 82, 0.08);
      color: rgba(255, 120, 120, 0.9);
      border: 1px solid rgba(255, 82, 82, 0.18);
    }

    .alert-success {
      background: rgba(0, 230, 118, 0.08);
      color: var(--eco-green);
      border: 1px solid rgba(0, 230, 118, 0.2);
    }

    /* Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid rgba(0, 200, 90, 0.08);
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #00c853, #00bfa5);
      color: #060e09;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 6px 20px rgba(0,200,83,0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(0,200,83,0.4);
    }

    .btn-secondary {
      padding: 12px 20px;
      background: rgba(0, 200, 90, 0.06);
      color: var(--muted);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: rgba(0, 200, 90, 0.1);
      color: var(--text);
    }

    .dots {
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #060e09;
      animation: blink 1.2s infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }

    @media (max-width: 600px) {
      .form-card { padding: 20px; }
      .form-row { grid-template-columns: 1fr; }
      .three-cols { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column-reverse; }
      .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
    }
  `]
})
export class SiteFormComponent implements OnInit {
  site: any = {
    name: '',
    surface: 0,
    parkingSpaces: 0,
    energyMWh: 0,
    employees: 0,
    concreteTons: 0,
    steelTons: 0,
    glassTons: 0
  };

  isEdit = false;
  loading = false;
  error = '';
  success = '';
  siteId: number | null = null;

  constructor(
    private siteService: SiteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.siteId = params['id'];
        this.loadSite();
      }
    });
  }

  loadSite(): void {
    if (!this.siteId) return;
    this.siteService.getSiteById(this.siteId).subscribe({
      next: (data) => { this.site = data; },
      error: () => { this.error = 'Erreur lors du chargement du site'; }
    });
  }

  saveSite(): void {
    if (!this.site.name || !this.site.surface) {
      this.error = 'Merci de remplir les champs obligatoires';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.isEdit && this.siteId) {
      this.siteService.updateSite(this.siteId, this.site).subscribe({
        next: () => {
          this.success = 'Site modifié avec succès';
          setTimeout(() => this.router.navigate(['/sites']), 1800);
        },
        error: () => { this.error = 'Erreur lors de la modification du site'; this.loading = false; }
      });
    } else {
      this.siteService.createSite(this.site).subscribe({
        next: () => {
          this.success = 'Site créé avec succès';
          setTimeout(() => this.router.navigate(['/sites']), 1800);
        },
        error: () => { this.error = 'Erreur lors de la création du site'; this.loading = false; }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/sites']);
  }
}

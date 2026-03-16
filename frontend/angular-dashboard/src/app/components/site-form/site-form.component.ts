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
    <div class="site-form-container">
      <div class="form-card">
        <h2>{{ isEdit ? 'Modifier site' : 'Créer un nouveau site' }}</h2>
        
        <form (ngSubmit)="saveSite()">
          <!-- Informations de base -->
          <fieldset>
            <legend>Informations du site</legend>
            
            <div class="form-group">
              <label>Nom du site *</label>
              <input 
                type="text" 
                [(ngModel)]="site.name" 
                name="name"
                required
                placeholder="Ex: Bâtiment A"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Surface (m²) *</label>
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
                <label>Employés *</label>
                <input 
                  type="number" 
                  [(ngModel)]="site.employees" 
                  name="employees"
                  required
                  placeholder="150"
                >
              </div>
            </div>
          </fieldset>

          <!-- Exploitation -->
          <fieldset>
            <legend>Données d'exploitation</legend>
            
            <div class="form-row">
              <div class="form-group">
                <label>Consommation énergétique (MWh/an) *</label>
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
                <label>Places de parking *</label>
                <input 
                  type="number" 
                  [(ngModel)]="site.parkingSpaces" 
                  name="parkingSpaces"
                  required
                  placeholder="100"
                >
              </div>
            </div>
          </fieldset>

          <!-- Matériaux de construction -->
          <fieldset>
            <legend>Matériaux de construction (tonnes)</legend>
            
            <div class="form-row">
              <div class="form-group">
                <label>Béton </label>
                <input 
                  type="number" 
                  [(ngModel)]="site.concreteTons" 
                  name="concreteTons"
                  step="0.1"
                  placeholder="0"
                >
              </div>

              <div class="form-group">
                <label>Acier</label>
                <input 
                  type="number" 
                  [(ngModel)]="site.steelTons" 
                  name="steelTons"
                  step="0.1"
                  placeholder="0"
                >
              </div>

              <div class="form-group">
                <label>Verre</label>
                <input 
                  type="number" 
                  [(ngModel)]="site.glassTons" 
                  name="glassTons"
                  step="0.1"
                  placeholder="0"
                >
              </div>
            </div>
          </fieldset>

          <div class="button-group">
            <button type="submit" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" (click)="goBack()" class="btn-secondary">
              Annuler
            </button>
          </div>
        </form>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <div *ngIf="success" class="success-message">
          {{ success }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .site-form-container {
      padding: 20px;
      background: transparent;
      min-height: 100vh;
    }

    .form-card {
      background: linear-gradient(145deg, rgba(0, 168, 247, 0.11), rgba(0, 207, 164, 0.1), rgba(255, 255, 255, 0.88));
      padding: 40px;
      border-radius: 22px;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--line);
      backdrop-filter: blur(10px);
    }

    h2 {
      margin-bottom: 30px;
      text-align: center;
      font-family: 'Orbitron', sans-serif;
      background: linear-gradient(120deg, var(--accent-cyan), var(--accent-teal), var(--accent-violet));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    fieldset {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid rgba(110, 233, 255, 0.2);
      border-radius: 14px;
      background: linear-gradient(140deg, rgba(0, 168, 247, 0.09), rgba(255, 159, 67, 0.08), rgba(255, 255, 255, 0.76));
    }

    legend {
      padding: 0 10px;
      font-weight: 600;
      color: var(--accent-cyan);
      letter-spacing: 0.04em;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.82rem;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(110, 233, 255, 0.22);
      border-radius: 10px;
      font-size: 14px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.9);
      color: var(--text);
    }

    input::placeholder {
      color: #7f98b7;
    }

    input:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 4px rgba(110, 233, 255, 0.18);
    }

    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 30px;
    }

    button {
      padding: 12px 30px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    button[type="submit"] {
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      color: #ffffff;
    }

    button[type="submit"]:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 22px rgba(44, 242, 201, 0.36);
    }

    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(157, 182, 211, 0.16);
      color: var(--text);
      border: 1px solid rgba(157, 182, 211, 0.35);
    }

    .btn-secondary:hover {
      background: rgba(157, 182, 211, 0.26);
    }

    .error-message {
      margin-top: 20px;
      padding: 15px;
      background: rgba(255, 127, 146, 0.12);
      color: #a12b46;
      border: 1px solid rgba(255, 127, 146, 0.32);
      border-radius: 12px;
      text-align: center;
    }

    .success-message {
      margin-top: 20px;
      padding: 15px;
      background: rgba(84, 227, 164, 0.12);
      color: #1c7d5a;
      border: 1px solid rgba(84, 227, 164, 0.38);
      border-radius: 12px;
      text-align: center;
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
      next: (data) => {
        this.site = data;
      },
      error: () => {
        this.error = 'Erreur lors du chargement du site';
      }
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
          setTimeout(() => this.router.navigate(['/sites']), 2000);
        },
        error: () => {
          this.error = 'Erreur lors de la modification du site';
          this.loading = false;
        }
      });
    } else {
      this.siteService.createSite(this.site).subscribe({
        next: () => {
          this.success = 'Site créé avec succès';
          setTimeout(() => this.router.navigate(['/sites']), 2000);
        },
        error: () => {
          this.error = 'Erreur lors de la création du site';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/sites']);
  }
}

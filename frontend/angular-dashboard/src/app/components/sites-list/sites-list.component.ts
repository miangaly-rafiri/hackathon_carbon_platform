import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sites-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Mes Sites</h1>
          <p class="page-subtitle">Gérez et suivez vos sites de construction</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="goToCompare()">
            Comparer 2 sites
          </button>
          <button class="btn-primary" (click)="createNewSite()">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <line x1="7.5" y1="1.5" x2="7.5" y2="13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="1.5" y1="7.5" x2="13.5" y2="7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Créer un site
          </button>
        </div>
      </div>

      <!-- States -->
      <div *ngIf="loading" class="loading-state">
        <div class="loading-bar"></div>
        <span>Chargement des sites...</span>
      </div>

      <div *ngIf="!loading && error" class="error-banner">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
        </svg>
        {{ error }}
      </div>

      <div *ngIf="!loading && sites.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" stroke="rgba(0,200,90,0.15)" stroke-width="2"/>
            <path d="M26 12 C18 20, 15 26, 26 29 C37 26, 34 20, 26 12Z" fill="rgba(0,230,118,0.12)" stroke="rgba(0,230,118,0.3)" stroke-width="1.5"/>
            <line x1="26" y1="29" x2="26" y2="38" stroke="rgba(0,230,118,0.3)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Aucun site créé</h3>
        <p>Commencez par créer votre premier site de suivi carbone</p>
        <button class="btn-primary" (click)="createNewSite()">Créer mon premier site</button>
      </div>

      <!-- Sites Grid -->
      <div *ngIf="!loading && sites.length > 0" class="sites-grid">
        <div *ngFor="let site of sites" class="site-card">
          <!-- Card header -->
          <div class="card-header">
            <div class="card-header-left">
              <div class="site-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14 L2 6 L8 2 L14 6 L14 14" stroke="url(#shg)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="5.5" y="9" width="5" height="5" rx="0.5" stroke="url(#shg)" stroke-width="1.5"/>
                  <defs>
                    <linearGradient id="shg" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#00e676"/>
                      <stop offset="100%" stop-color="#00bfa5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 class="site-name">{{ site.name }}</h3>
            </div>
            <div class="site-actions">
              <button class="btn-icon" (click)="editSite(site.id)" title="Modifier">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="btn-icon danger" (click)="deleteSite(site.id)" title="Supprimer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polyline points="2,4 3,4 12,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M5 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M11 4l-.75 7.25A1 1 0 0 1 9.26 12H4.74a1 1 0 0 1-.99-.75L3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Card body -->
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Surface</span>
              <span class="info-value">{{ site.surface | number:'1.0-0' }} m²</span>
            </div>
            <div class="info-row">
              <span class="info-label">Employés</span>
              <span class="info-value">{{ site.employees }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Énergie</span>
              <span class="info-value">{{ site.energyMWh }} MWh/an</span>
            </div>
          </div>

          <!-- Carbon metrics -->
          <div class="carbon-metrics">
            <div class="metric">
              <span class="metric-label">CO₂ Total</span>
              <span class="metric-value primary">{{ site.totalCO2 | number:'1.0-0' }} <small>kg</small></span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric">
              <span class="metric-label">CO₂/m²</span>
              <span class="metric-value">{{ (site.totalCO2 / site.surface) | number:'1.0-0' }} <small>kg</small></span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric">
              <span class="metric-label">CO₂/emp</span>
              <span class="metric-value">{{ (site.totalCO2 / site.employees) | number:'1.0-0' }} <small>kg</small></span>
            </div>
          </div>

          <!-- Card footer -->
          <button class="btn-details" (click)="viewDetails(site.id)">
            <span>Voir les détails</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sites-container {
      padding: 0;
      min-height: 100vh;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 28px;
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

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .btn-secondary {
      padding: 12px 18px;
      background: rgba(157, 182, 211, 0.18);
      color: var(--text);
      border: 1px solid rgba(157, 182, 211, 0.36);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      background: rgba(157, 182, 211, 0.26);
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 11px 20px;
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

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(0,200,83,0.4);
    }

    /* Loading */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 60px;
      color: var(--muted);
      font-size: 13px;
    }

    .loading-bar {
      width: 120px;
      height: 3px;
      background: rgba(0,200,90,0.1);
      border-radius: 99px;
      overflow: hidden;
    }

    .loading-bar::after {
      content: '';
      display: block;
      width: 40%;
      height: 100%;
      background: var(--eco-green);
      border-radius: 99px;
      animation: slide 1.2s infinite;
    }

    @keyframes slide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }

    /* Error */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 18px;
      background: rgba(255, 82, 82, 0.07);
      color: rgba(255, 120, 120, 0.9);
      border: 1px solid rgba(255, 82, 82, 0.18);
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 64px 24px;
      text-align: center;
    }

    .empty-icon { margin-bottom: 8px; }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
    }

    .empty-state p {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 8px;
    }

    /* Grid */
    .sites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }

    /* Card */
    .site-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 14px;
      overflow: hidden;
      backdrop-filter: blur(10px);
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
    }

    .site-card:hover {
      border-color: rgba(0, 200, 90, 0.28);
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,230,118,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 18px;
      background: rgba(0, 200, 90, 0.05);
      border-bottom: 1px solid rgba(0, 200, 90, 0.1);
    }

    .card-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .site-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(0,230,118,0.1);
      border: 1px solid rgba(0,230,118,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .site-name {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-bright);
    }

    .site-actions {
      display: flex;
      gap: 6px;
    }

    .btn-icon {
      width: 30px;
      height: 30px;
      border-radius: 7px;
      background: rgba(0,200,90,0.06);
      border: 1px solid rgba(0,200,90,0.14);
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .btn-icon:hover {
      background: rgba(0,230,118,0.12);
      color: var(--eco-green);
      border-color: rgba(0,230,118,0.3);
    }

    .btn-icon.danger:hover {
      background: rgba(255,82,82,0.1);
      color: #ff6b6b;
      border-color: rgba(255,82,82,0.25);
    }

    .card-body {
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-label {
      color: var(--muted);
      font-size: 13px;
    }

    .info-value {
      color: var(--text);
      font-size: 13px;
      font-weight: 500;
    }

    .carbon-metrics {
      display: flex;
      align-items: stretch;
      margin: 0 18px;
      background: rgba(0, 200, 90, 0.04);
      border: 1px solid rgba(0, 200, 90, 0.1);
      border-radius: 10px;
      overflow: hidden;
    }

    .metric {
      flex: 1;
      padding: 12px 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-divider {
      width: 1px;
      background: rgba(0,200,90,0.1);
    }

    .metric-label {
      font-size: 10px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .metric-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .metric-value.primary {
      color: var(--eco-green);
      font-family: 'Orbitron', sans-serif;
      font-size: 13px;
    }

    .metric-value small {
      font-size: 10px;
      font-weight: 400;
      opacity: 0.7;
    }

    .btn-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px;
      margin: 16px 18px 18px;
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid rgba(0, 230, 118, 0.18);
      border-radius: 10px;
      color: var(--eco-green);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-details:hover {
      background: rgba(0, 230, 118, 0.14);
      border-color: rgba(0, 230, 118, 0.32);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .sites-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SiteListComponent implements OnInit {
  sites: any[] = [];
  loading = false;
  error = '';

  constructor(
    private siteService: SiteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.loading = true;
    this.error = '';
    this.siteService.getAllSites().subscribe({
      next: (data) => {
        this.sites = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur lors du chargement des sites';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createNewSite(): void {
    this.router.navigate(['/sites/new']);
  }

  goToCompare(): void {
    this.router.navigate(['/sites/compare']);
  }

  editSite(id: number): void {
    this.router.navigate(['/sites/edit', id]);
  }

  deleteSite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      this.siteService.deleteSite(id).subscribe({
        next: () => this.loadSites(),
        error: () => { this.error = 'Erreur lors de la suppression'; }
      });
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/sites/details', id]);
  }
}

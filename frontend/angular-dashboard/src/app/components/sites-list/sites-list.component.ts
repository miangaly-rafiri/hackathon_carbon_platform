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
      <div class="sites-header">
        <h2>Mes sites</h2>
        <button class="btn-primary" (click)="createNewSite()">
          + Créer un site
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        Chargement des sites...
      </div>

      <div *ngIf="!loading && error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="!loading && sites.length === 0" class="no-sites">
        <p>Aucun site créé. Commencez par en créer un !</p>
      </div>

      <div *ngIf="!loading && sites.length > 0" class="sites-grid">
        <div *ngFor="let site of sites" class="site-card">
          <div class="site-header">
            <h3>{{ site.name }}</h3>
            <div class="site-actions">
              <button 
                class="btn-edit" 
                (click)="editSite(site.id)"
                title="Modifier"
              >
                ✏️
              </button>
              <button 
                class="btn-delete" 
                (click)="deleteSite(site.id)"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>

          <div class="site-content">
            <div class="info-row">
              <span class="label">Surface :</span>
              <span class="value">{{ site.surface }} m²</span>
            </div>

            <div class="info-row">
              <span class="label">Employés :</span>
              <span class="value">{{ site.employees }}</span>
            </div>

            <div class="info-row">
              <span class="label">Consommation énergétique :</span>
              <span class="value">{{ site.energyMWh }} MWh/an</span>
            </div>

            <div class="carbon-data">
              <div class="co2-box">
                <span class="label">CO₂ Total :</span>
                <span class="value">{{ site.totalCO2 | number:'1.0-0' }} kg</span>
              </div>
              <div class="co2-box">
                <span class="label">CO₂/m² :</span>
                <span class="value">{{ (site.totalCO2 / site.surface) | number:'1.0-0' }} kg</span>
              </div>
              <div class="co2-box">
                <span class="label">CO₂/emp :</span>
                <span class="value">{{ (site.totalCO2 / site.employees) | number:'1.0-0' }} kg</span>
              </div>
            </div>
          </div>

          <button 
            class="btn-details" 
            (click)="viewDetails(site.id)"
          >
            Voir détails
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sites-container {
      padding: 20px;
      background: transparent;
      min-height: 100vh;
    }

    .sites-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      background: linear-gradient(145deg, rgba(0, 168, 247, 0.13), rgba(255, 110, 199, 0.1), rgba(255, 255, 255, 0.86));
      padding: 20px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
    }

    h2 {
      margin: 0;
      color: var(--text);
      font-family: 'Orbitron', sans-serif;
    }

    .btn-primary {
      padding: 12px 25px;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 10px 20px rgba(44, 242, 201, 0.28);
    }

    .btn-primary:hover {
      transform: translateY(-2px) scale(1.01);
    }

    .loading {
      text-align: center;
      padding: 40px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      color: var(--muted);
    }

    .error-message {
      padding: 20px;
      background: rgba(255, 127, 146, 0.14);
      border: 1px solid rgba(255, 127, 146, 0.35);
      color: #a12b46;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .no-sites {
      text-align: center;
      padding: 60px 20px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      color: var(--muted);
    }

    .sites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .site-card {
      background: linear-gradient(145deg, rgba(0, 207, 164, 0.09), rgba(123, 141, 255, 0.09), rgba(255, 255, 255, 0.86));
      border-radius: var(--radius-lg);
      border: 1px solid rgba(110, 233, 255, 0.2);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(6px);
      overflow: hidden;
      transition: transform 0.22s ease, border-color 0.22s ease;
    }

    .site-card:hover {
      transform: translateY(-5px);
      border-color: rgba(110, 233, 255, 0.45);
    }

    .site-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: linear-gradient(135deg, rgba(0, 168, 247, 0.2), rgba(123, 141, 255, 0.17), rgba(255, 110, 199, 0.12));
      border-bottom: 1px solid rgba(110, 233, 255, 0.2);
      color: var(--text);
    }

    .site-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .site-actions {
      display: flex;
      gap: 10px;
    }

    .btn-edit, .btn-delete {
      background: rgba(255, 255, 255, 0.74);
      border: none;
      color: var(--text);
      padding: 5px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-edit:hover, .btn-delete:hover {
      background: rgba(110, 233, 255, 0.24);
    }

    .site-content {
      padding: 20px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .info-row .label {
      color: var(--muted);
      font-weight: 500;
    }

    .info-row .value {
      color: var(--text);
      font-weight: 600;
    }

    .carbon-data {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .co2-box {
      background: rgba(255, 255, 255, 0.8);
      padding: 10px;
      border-radius: 10px;
      text-align: center;
      font-size: 12px;
      border: 1px solid rgba(110, 233, 255, 0.12);
    }

    .co2-box .label {
      display: block;
      color: var(--muted);
      margin-bottom: 5px;
    }

    .co2-box .value {
      display: block;
      color: var(--accent-cyan);
      font-weight: 700;
      font-size: 14px;
    }

    .btn-details {
      width: 100%;
      padding: 12px;
      background: linear-gradient(90deg, rgba(0, 168, 247, 0.12), rgba(255, 110, 199, 0.12));
      border: none;
      border-top: 1px solid rgba(110, 233, 255, 0.2);
      cursor: pointer;
      font-weight: 600;
      color: var(--text);
      transition: background 0.25s ease;
    }

    .btn-details:hover {
      background: linear-gradient(90deg, rgba(0, 207, 164, 0.18), rgba(123, 141, 255, 0.16));
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

  editSite(id: number): void {
    this.router.navigate(['/sites/edit', id]);
  }

  deleteSite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      this.siteService.deleteSite(id).subscribe({
        next: () => {
          this.loadSites();
        },
        error: () => {
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/sites/details', id]);
  }
}

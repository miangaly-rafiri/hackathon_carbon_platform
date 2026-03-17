import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-site-details',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="details-page">
      <!-- Loading -->
      <div *ngIf="loading" class="loading-state">
        <div class="loading-bar"></div>
        <span>Chargement des données du site...</span>
      </div>

      <div *ngIf="!loading && site">
        <!-- Header -->
        <div class="page-header">
          <button class="btn-back" (click)="goBack()">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Retour aux sites
          </button>

          <div class="site-title-row">
            <div class="site-title-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 22 L3 9 L12 3 L21 9 L21 22" stroke="url(#dtg)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="8" y="14" width="8" height="8" rx="0.5" stroke="url(#dtg)" stroke-width="1.75"/>
                <defs>
                  <linearGradient id="dtg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#00e676"/>
                    <stop offset="100%" stop-color="#00bfa5"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 class="site-title">{{ site.name }}</h1>
              <p class="site-meta">{{ site.surface | number:'1.0-0' }} m² · {{ site.employees }} employés</p>
            </div>
          </div>
        </div>

        <!-- Site KPIs -->
        <div class="kpi-row">
          <div class="kpi-item">
            <span class="kpi-label">Surface</span>
            <span class="kpi-val">{{ site.surface | number:'1.0-0' }}</span>
            <span class="kpi-unit">m²</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Employés</span>
            <span class="kpi-val">{{ site.employees }}</span>
            <span class="kpi-unit">pers.</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Énergie</span>
            <span class="kpi-val">{{ site.energyMWh | number:'1.0-0' }}</span>
            <span class="kpi-unit">MWh/an</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Parking</span>
            <span class="kpi-val">{{ site.parkingSpaces }}</span>
            <span class="kpi-unit">places</span>
          </div>
        </div>

        <!-- CO2 Cards -->
        <div class="co2-section">
          <div class="co2-card co2-total">
            <div class="co2-badge">CO₂ Total</div>
            <div class="co2-main-value">{{ site.totalCO2 | number:'1.0-0' }}</div>
            <div class="co2-unit">kg CO₂e</div>
            <div class="co2-glow"></div>
          </div>

          <div class="co2-card">
            <div class="co2-badge construction">Construction</div>
            <div class="co2-value">{{ site.constructionCO2 | number:'1.0-0' }}</div>
            <div class="co2-unit">kg CO₂e</div>
            <div class="co2-ratio">{{ (site.constructionCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</div>
          </div>

          <div class="co2-card">
            <div class="co2-badge exploitation">Exploitation</div>
            <div class="co2-value">{{ site.operationCO2 | number:'1.0-0' }}</div>
            <div class="co2-unit">kg CO₂e</div>
            <div class="co2-ratio teal">{{ (site.operationCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</div>
          </div>

          <div class="co2-card">
            <div class="co2-badge">Par m²</div>
            <div class="co2-value lime">{{ (site.totalCO2 / site.surface) | number:'1.0-0' }}</div>
            <div class="co2-unit">kg/m²</div>
          </div>

          <div class="co2-card">
            <div class="co2-badge">Par employé</div>
            <div class="co2-value amber">{{ (site.totalCO2 / site.employees) | number:'1.0-0' }}</div>
            <div class="co2-unit">kg/employé</div>
          </div>
        </div>

        <!-- Charts -->
        <div class="charts-row">
          <div class="chart-card">
            <div class="chart-title">
              <h3>Répartition CO₂</h3>
              <span class="chart-tag">Camembert</span>
            </div>
            <div class="chart-body">
              <canvas
                baseChart
                [type]="chartType"
                [data]="pieChartData"
                [options]="chartOptions"
              ></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-title">
              <h3>Matériaux de construction</h3>
              <span class="chart-tag">Tonnes</span>
            </div>
            <div class="chart-body">
              <div class="materials-list">
                <div class="material-row" *ngIf="site.concreteTons > 0">
                  <div class="mat-label">
                    <span class="mat-dot green"></span>
                    Béton
                  </div>
                  <div class="mat-bar">
                    <div class="mat-fill" [style.width.%]="getMatPct(site.concreteTons)"></div>
                  </div>
                  <span class="mat-val">{{ site.concreteTons }} t</span>
                </div>
                <div class="material-row" *ngIf="site.steelTons > 0">
                  <div class="mat-label">
                    <span class="mat-dot teal"></span>
                    Acier
                  </div>
                  <div class="mat-bar">
                    <div class="mat-fill teal" [style.width.%]="getMatPct(site.steelTons)"></div>
                  </div>
                  <span class="mat-val">{{ site.steelTons }} t</span>
                </div>
                <div class="material-row" *ngIf="site.glassTons > 0">
                  <div class="mat-label">
                    <span class="mat-dot lime"></span>
                    Verre
                  </div>
                  <div class="mat-bar">
                    <div class="mat-fill lime" [style.width.%]="getMatPct(site.glassTons)"></div>
                  </div>
                  <span class="mat-val">{{ site.glassTons }} t</span>
                </div>
                <div *ngIf="site.concreteTons === 0 && site.steelTons === 0 && site.glassTons === 0"
                     class="no-materials">
                  Aucun matériau renseigné
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="history-card">
          <div class="history-header">
            <h3>Historique des calculs</h3>
            <span class="history-count">{{ history.length }} entrée{{ history.length > 1 ? 's' : '' }}</span>
          </div>

          <div *ngIf="history.length === 0" class="empty-history">
            <p>Aucun historique disponible</p>
          </div>

          <div class="table-wrapper" *ngIf="history.length > 0">
            <table class="eco-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>CO₂ Total (kg)</th>
                  <th>Construction (kg)</th>
                  <th>Exploitation (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of history">
                  <td class="date-cell">{{ record.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td class="co2-cell">{{ record.totalCO2 | number:'1.0-0' }}</td>
                  <td>{{ record.constructionCO2 | number:'1.0-0' }}</td>
                  <td>{{ record.operationCO2 | number:'1.0-0' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-page {
      min-height: 100vh;
    }

    /* Loading */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 80px;
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
      margin-bottom: 20px;
    }

    .btn-back:hover {
      color: var(--eco-green);
      background: rgba(0, 230, 118, 0.08);
      border-color: rgba(0, 230, 118, 0.3);
    }

    .site-title-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .site-title-icon {
      width: 52px;
      height: 52px;
      min-width: 52px;
      border-radius: 14px;
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid rgba(0, 230, 118, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 8px rgba(0,230,118,0.2));
    }

    .site-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-bright);
      letter-spacing: 0.03em;
      margin-bottom: 4px;
    }

    .site-meta {
      color: var(--muted);
      font-size: 13px;
    }

    /* KPI Row */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .kpi-item {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.12);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .kpi-label {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .kpi-val {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-bright);
    }

    .kpi-unit {
      font-size: 11px;
      color: var(--muted);
    }

    /* CO2 section */
    .co2-section {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .co2-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.12);
      border-radius: 12px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      position: relative;
      overflow: hidden;
    }

    .co2-total {
      border-color: rgba(0, 230, 118, 0.22);
    }

    .co2-glow {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 80px;
      background: radial-gradient(circle, rgba(0,230,118,0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .co2-badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      background: rgba(0,200,90,0.07);
      padding: 3px 8px;
      border-radius: 99px;
      border: 1px solid rgba(0,200,90,0.12);
    }

    .co2-badge.construction { color: var(--eco-green); background: rgba(0,230,118,0.07); border-color: rgba(0,230,118,0.15); }
    .co2-badge.exploitation { color: var(--eco-teal); background: rgba(0,191,165,0.07); border-color: rgba(0,191,165,0.15); }

    .co2-main-value {
      font-size: 30px;
      font-weight: 700;
      color: var(--eco-green);
      font-family: 'Orbitron', sans-serif;
      line-height: 1;
    }

    .co2-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-bright);
    }

    .co2-value.lime { color: #b2ff59; }
    .co2-value.amber { color: var(--amber); }

    .co2-unit {
      font-size: 11px;
      color: var(--muted);
    }

    .co2-ratio {
      font-size: 13px;
      font-weight: 600;
      color: var(--eco-green);
    }

    .co2-ratio.teal { color: var(--eco-teal); }

    /* Charts */
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .chart-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.12);
      border-radius: 14px;
      overflow: hidden;
    }

    .chart-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0, 200, 90, 0.08);
    }

    .chart-title h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .chart-tag {
      font-size: 11px;
      color: var(--eco-teal);
      background: rgba(0,191,165,0.08);
      border: 1px solid rgba(0,191,165,0.18);
      padding: 3px 8px;
      border-radius: 99px;
    }

    .chart-body {
      padding: 20px;
    }

    .chart-body canvas {
      max-height: 230px;
    }

    /* Materials */
    .materials-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .material-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mat-label {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 60px;
      font-size: 13px;
      color: var(--muted);
    }

    .mat-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .mat-dot.green { background: var(--eco-green); }
    .mat-dot.teal { background: var(--eco-teal); }
    .mat-dot.lime { background: #b2ff59; }

    .mat-bar {
      flex: 1;
      height: 6px;
      background: rgba(0, 200, 90, 0.1);
      border-radius: 99px;
      overflow: hidden;
    }

    .mat-fill {
      height: 100%;
      background: var(--eco-green);
      border-radius: 99px;
      transition: width 0.4s ease;
    }

    .mat-fill.teal { background: var(--eco-teal); }
    .mat-fill.lime { background: #b2ff59; }

    .mat-val {
      min-width: 48px;
      text-align: right;
      font-size: 13px;
      font-weight: 600;
      color: var(--eco-green);
    }

    .no-materials {
      color: var(--muted);
      font-size: 13px;
      text-align: center;
      padding: 20px;
    }

    /* History */
    .history-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.12);
      border-radius: 14px;
      overflow: hidden;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 22px;
      border-bottom: 1px solid rgba(0, 200, 90, 0.08);
    }

    .history-header h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .history-count {
      font-size: 12px;
      color: var(--muted);
      background: rgba(0, 200, 90, 0.07);
      padding: 3px 9px;
      border-radius: 99px;
      border: 1px solid rgba(0, 200, 90, 0.12);
    }

    .empty-history {
      text-align: center;
      padding: 40px;
      color: var(--muted);
      font-size: 14px;
    }

    .table-wrapper { overflow-x: auto; }

    .eco-table {
      width: 100%;
      border-collapse: collapse;
    }

    .eco-table thead tr {
      background: rgba(0, 200, 90, 0.04);
      border-bottom: 1px solid rgba(0, 200, 90, 0.1);
    }

    .eco-table th {
      padding: 12px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .eco-table td {
      padding: 13px 20px;
      border-bottom: 1px solid rgba(0, 200, 90, 0.05);
      font-size: 14px;
      color: var(--muted);
    }

    .eco-table tbody tr:hover td { background: rgba(0, 200, 90, 0.03); }
    .eco-table tbody tr:last-child td { border-bottom: none; }

    .date-cell { font-size: 13px; }
    .co2-cell { color: var(--eco-green) !important; font-weight: 600; }

    @media (max-width: 900px) {
      .kpi-row { grid-template-columns: repeat(2, 1fr); }
      .co2-section { grid-template-columns: 1fr 1fr; }
      .charts-row { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .kpi-row { grid-template-columns: repeat(2, 1fr); }
      .co2-section { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class SiteDetailsComponent implements OnInit {
  site: any = null;
  history: any[] = [];
  loading = false;
  maxMaterial = 1;

  chartType: 'pie' = 'pie';
  pieChartData: any = {
    labels: ['Construction', 'Exploitation'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['rgba(0,230,118,0.7)', 'rgba(29,233,182,0.7)'],
      borderColor: ['rgba(0,230,118,1)', 'rgba(29,233,182,1)'],
      borderWidth: 2
    }]
  };

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#4d7a5c', font: { family: 'Space Grotesk' } }
      }
    }
  };

  constructor(
    private siteService: SiteService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const siteId = params['id'];
      if (siteId) this.loadSiteDetails(siteId);
    });
  }

  loadSiteDetails(id: number): void {
    this.loading = true;
    this.siteService.getSiteById(id).subscribe({
      next: (data) => {
        this.site = data;
        this.maxMaterial = Math.max(this.site.concreteTons || 1, this.site.steelTons || 1, this.site.glassTons || 1);
        this.updateChart();
        this.loadHistory(id);
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  loadHistory(id: number): void {
    this.siteService.getCarbonHistory(id).subscribe({
      next: (data) => { this.history = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.history = []; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  updateChart(): void {
    this.pieChartData.datasets[0].data = [this.site.constructionCO2 || 0, this.site.operationCO2 || 0];
  }

  getMatPct(val: number): number {
    return (val / this.maxMaterial) * 100;
  }

  goBack(): void {
    this.router.navigate(['/sites']);
  }
}

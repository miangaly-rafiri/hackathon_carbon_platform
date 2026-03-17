import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from '../../services/site.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>
            <span class="title-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2 C7 7, 5 11, 11 13 C17 11, 15 7, 11 2Z" fill="url(#dg1)"/>
                <path d="M11 13 L11 20" stroke="url(#dg1)" stroke-width="2" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="dg1" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#00e676"/>
                    <stop offset="100%" stop-color="#00bfa5"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            Dashboard Carbone
          </h1>
          <p class="page-subtitle">Vue d'ensemble de l'empreinte carbone de vos sites</p>
        </div>
        <div class="header-badge">
          <span class="badge-dot"></span>
          <span>{{ sitesCount }} site{{ sitesCount > 1 ? 's' : '' }} suivi{{ sitesCount > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="url(#kg1)" stroke-width="1.5"/>
              <path d="M10 4 C7 7, 6 10, 10 11.5 C14 10, 13 7, 10 4Z" fill="url(#kg1)" opacity="0.9"/>
              <line x1="10" y1="11.5" x2="10" y2="16" stroke="url(#kg1)" stroke-width="1.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="kg1" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#00e676"/>
                  <stop offset="100%" stop-color="#00bfa5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">CO₂ Total émis</div>
            <div class="kpi-value">{{ totalCO2 | number:'1.0-0' }}</div>
            <div class="kpi-unit">kg CO₂e</div>
          </div>
          <div class="kpi-glow"></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(29,233,182,0.1); border-color: rgba(29,233,182,0.25);">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 16 L2 5.5 L10 1.5 L18 5.5 L18 16" stroke="#1de9b6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="6.5" y="10.5" width="7" height="5.5" rx="1" stroke="#1de9b6" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">Sites actifs</div>
            <div class="kpi-value" style="color: #1de9b6;">{{ sitesCount }}</div>
            <div class="kpi-unit">sites</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(178,255,89,0.08); border-color: rgba(178,255,89,0.22);">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#b2ff59" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">CO₂ moyen / site</div>
            <div class="kpi-value" style="color: #b2ff59;">{{ averageCO2 | number:'1.0-0' }}</div>
            <div class="kpi-unit">kg CO₂e</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(255,171,64,0.08); border-color: rgba(255,171,64,0.22);">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="#ffab40" stroke-width="1.5" stroke-dasharray="3 2"/>
              <path d="M10 10 L10 3" stroke="#ffab40" stroke-width="2" stroke-linecap="round"/>
              <path d="M10 10 L14 8" stroke="#ffab40" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">Part Construction</div>
            <div class="kpi-value" style="color: #ffab40;">{{ (constructionRatio * 100) | number:'1.0-0' }}%</div>
            <div class="kpi-unit">construction</div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3>CO₂ Total par site</h3>
            <span class="chart-tag">Barres</span>
          </div>
          <div class="chart-body">
            <canvas
              baseChart
              [type]="chartTypes.bar"
              [data]="barChartData"
              [options]="barChartOptions"
              [plugins]="barChartPlugins"
            ></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Construction vs Exploitation</h3>
            <span class="chart-tag">Répartition</span>
          </div>
          <div class="chart-body">
            <canvas
              baseChart
              [type]="chartTypes.pie"
              [data]="pieChartData"
              [options]="pieChartOptions"
            ></canvas>
          </div>
        </div>
      </div>

      <!-- Sites Table -->
      <div class="table-card">
        <div class="table-header">
          <h3>Détails par site</h3>
          <span class="table-count">{{ sites.length }} résultat{{ sites.length > 1 ? 's' : '' }}</span>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="loading-bar"></div>
          <span>Chargement des données...</span>
        </div>

        <div *ngIf="!loading && sites.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="rgba(0,200,90,0.2)" stroke-width="2"/>
            <path d="M20 10 C13 17, 11 22, 20 25 C29 22, 27 17, 20 10Z" fill="rgba(0,200,90,0.15)"/>
          </svg>
          <p>Aucun site à afficher</p>
        </div>

        <div class="table-wrapper" *ngIf="!loading && sites.length > 0">
          <table class="eco-table">
            <thead>
              <tr>
                <th>Site</th>
                <th>Surface (m²)</th>
                <th>CO₂ Total (kg)</th>
                <th>CO₂/m²</th>
                <th>Construction</th>
                <th>Exploitation</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let site of sites">
                <td class="site-name">{{ site.name }}</td>
                <td>{{ site.surface | number:'1.0-0' }}</td>
                <td class="co2-value">{{ site.totalCO2 | number:'1.0-0' }}</td>
                <td>{{ (site.totalCO2 / site.surface) | number:'1.0-0' }}</td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="(site.constructionCO2 / site.totalCO2 * 100)"></div>
                    </div>
                    <span>{{ (site.constructionCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</span>
                  </div>
                </td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-bar">
                      <div class="progress-fill teal" [style.width.%]="(site.operationCO2 / site.totalCO2 * 100)"></div>
                    </div>
                    <span>{{ (site.operationCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
      min-height: 100vh;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 28px;
      padding: 0 2px;
    }

    .page-title h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Orbitron', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-bright);
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }

    .title-icon {
      display: flex;
      align-items: center;
      filter: drop-shadow(0 0 8px rgba(0,230,118,0.5));
    }

    .page-subtitle {
      color: var(--muted);
      font-size: 13px;
    }

    .header-badge {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 14px;
      background: rgba(0, 230, 118, 0.07);
      border: 1px solid rgba(0, 230, 118, 0.18);
      border-radius: 99px;
      font-size: 13px;
      color: var(--eco-green);
      font-weight: 500;
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--eco-green);
      box-shadow: 0 0 6px rgba(0,230,118,0.7);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 14px;
      padding: 22px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      backdrop-filter: blur(10px);
    }

    .kpi-card:hover {
      border-color: rgba(0, 200, 90, 0.28);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
    }

    .kpi-primary {
      border-color: rgba(0, 230, 118, 0.2);
    }

    .kpi-primary .kpi-glow {
      position: absolute;
      top: -30px;
      right: -30px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .kpi-icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 10px;
      background: rgba(0,230,118,0.1);
      border: 1px solid rgba(0,230,118,0.22);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-label {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 6px;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--eco-green);
      line-height: 1;
      margin-bottom: 4px;
      font-family: 'Orbitron', sans-serif;
    }

    .kpi-unit {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
    }

    /* Charts */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .chart-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 14px;
      overflow: hidden;
      backdrop-filter: blur(10px);
      transition: border-color 0.2s, transform 0.2s;
    }

    .chart-card:hover {
      border-color: rgba(0, 200, 90, 0.26);
      transform: translateY(-2px);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 22px 0;
    }

    .chart-header h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .chart-tag {
      font-size: 11px;
      color: var(--eco-teal);
      background: rgba(0,191,165,0.1);
      border: 1px solid rgba(0,191,165,0.2);
      padding: 3px 8px;
      border-radius: 99px;
    }

    .chart-body {
      padding: 16px 22px 22px;
    }

    .chart-body canvas {
      max-height: 280px;
    }

    /* Table */
    .table-card {
      background: rgba(8, 22, 12, 0.88);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 14px;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(0, 200, 90, 0.1);
    }

    .table-header h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .table-count {
      font-size: 12px;
      color: var(--muted);
      background: rgba(0, 200, 90, 0.07);
      padding: 3px 9px;
      border-radius: 99px;
      border: 1px solid rgba(0, 200, 90, 0.12);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 40px;
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

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px;
      color: var(--muted);
      font-size: 14px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .eco-table {
      width: 100%;
      border-collapse: collapse;
    }

    .eco-table thead tr {
      background: rgba(0, 200, 90, 0.05);
      border-bottom: 1px solid rgba(0, 200, 90, 0.12);
    }

    .eco-table th {
      padding: 12px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      white-space: nowrap;
    }

    .eco-table td {
      padding: 14px 20px;
      border-bottom: 1px solid rgba(0, 200, 90, 0.06);
      font-size: 14px;
      color: var(--muted);
    }

    .eco-table tbody tr:hover td {
      background: rgba(0, 200, 90, 0.04);
    }

    .eco-table tbody tr:last-child td {
      border-bottom: none;
    }

    .site-name {
      color: var(--text) !important;
      font-weight: 600;
    }

    .co2-value {
      color: var(--eco-green) !important;
      font-weight: 600;
      font-family: 'Orbitron', sans-serif;
      font-size: 13px !important;
    }

    .progress-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 100px;
    }

    .progress-bar {
      flex: 1;
      height: 5px;
      background: rgba(0,200,90,0.1);
      border-radius: 99px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--eco-green);
      border-radius: 99px;
      transition: width 0.4s ease;
    }

    .progress-fill.teal {
      background: var(--eco-teal);
    }

    .progress-cell span {
      font-size: 12px;
      min-width: 36px;
      text-align: right;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
      }

      .kpi-grid {
        grid-template-columns: 1fr 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  sites: any[] = [];
  loading = false;

  totalCO2 = 0;
  sitesCount = 0;
  averageCO2 = 0;
  constructionRatio = 0;

  chartTypes: { bar: 'bar'; pie: 'pie' } = { bar: 'bar', pie: 'pie' };

  barChartData: any = {
    labels: [],
    datasets: [{
      label: 'CO₂ Total (kg)',
      data: [],
      backgroundColor: 'rgba(0, 230, 118, 0.35)',
      borderColor: 'rgba(0, 230, 118, 0.85)',
      borderWidth: 1.5,
      borderRadius: 6,
    }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x',
    plugins: {
      legend: {
        labels: { color: '#4d7a5c', font: { family: 'Space Grotesk' } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#4d7a5c' },
        grid: { color: 'rgba(0,200,90,0.07)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#4d7a5c' },
        grid: { color: 'rgba(0,200,90,0.07)' }
      }
    }
  };

  barChartPlugins = [];

  pieChartData: any = {
    labels: ['Construction', 'Exploitation'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['rgba(0,230,118,0.7)', 'rgba(29,233,182,0.7)'],
      borderColor: ['rgba(0,230,118,1)', 'rgba(29,233,182,1)'],
      borderWidth: 2
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#4d7a5c', font: { family: 'Space Grotesk' } }
      }
    }
  };

  constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.siteService.getAllSites().subscribe({
      next: (data) => {
        this.sites = data;
        this.calculateKPIs();
        this.updateCharts();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateKPIs(): void {
    this.sitesCount = this.sites.length;
    if (this.sites.length === 0) { this.totalCO2 = 0; this.averageCO2 = 0; this.constructionRatio = 0; return; }

    let totalConstruction = 0;
    let totalOperation = 0;

    this.totalCO2 = this.sites.reduce((sum, site) => {
      totalConstruction += site.constructionCO2 || 0;
      totalOperation += site.operationCO2 || 0;
      return sum + (site.totalCO2 || 0);
    }, 0);

    this.averageCO2 = this.totalCO2 / this.sitesCount;
    this.constructionRatio = totalConstruction / this.totalCO2 || 0;
    this.pieChartData.datasets[0].data = [totalConstruction, totalOperation];
  }

  updateCharts(): void {
    this.barChartData.labels = this.sites.map(s => s.name);
    this.barChartData.datasets[0].data = this.sites.map(s => s.totalCO2 || 0);
  }
}

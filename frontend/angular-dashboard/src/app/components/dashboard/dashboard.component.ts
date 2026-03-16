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
      <h1>Dashboard Carbone</h1>

      <!-- KPI principaux -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total CO₂ (tous sites)</div>
          <div class="kpi-value">{{ totalCO2 | number:'1.0-0' }}</div>
          <div class="kpi-unit">kg CO₂e</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Nombre de sites</div>
          <div class="kpi-value">{{ sitesCount }}</div>
          <div class="kpi-unit">sites</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">CO₂ moyen par site</div>
          <div class="kpi-value">{{ averageCO2 | number:'1.0-0' }}</div>
          <div class="kpi-unit">kg CO₂e</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">CO₂ Construction vs Exploitation</div>
          <div class="kpi-value">{{ (constructionRatio * 100) | number:'1.0-0' }}%</div>
          <div class="kpi-unit">construction</div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="charts-section">
        <div class="chart-container">
          <h3>CO₂ Total par site</h3>
          <canvas 
            baseChart
            [type]="chartTypes.bar"
            [data]="barChartData"
            [options]="barChartOptions"
            [plugins]="barChartPlugins"
          ></canvas>
        </div>

        <div class="chart-container">
          <h3>Répartition Construction / Exploitation</h3>
          <canvas 
            baseChart
            [type]="chartTypes.pie"
            [data]="pieChartData"
            [options]="pieChartOptions"
          ></canvas>
        </div>
      </div>

      <!-- Détails par site -->
      <div class="sites-details">
        <h3>Détails par site</h3>
        <div *ngIf="loading" class="loading">
          Chargement...
        </div>

        <table *ngIf="!loading && sites.length > 0" class="sites-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Surface (m²)</th>
              <th>CO₂ Total (kg)</th>
              <th>CO₂/m² (kg)</th>
              <th>CO₂ Construction %</th>
              <th>CO₂ Exploitation %</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let site of sites">
              <td>{{ site.name }}</td>
              <td>{{ site.surface | number:'1.0-0' }}</td>
              <td>{{ site.totalCO2 | number:'1.0-0' }}</td>
              <td>{{ (site.totalCO2 / site.surface) | number:'1.0-0' }}</td>
              <td>{{ (site.constructionCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</td>
              <td>{{ (site.operationCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      background: transparent;
      min-height: 100vh;
    }

    h1 {
      color: var(--text);
      font-family: 'Orbitron', sans-serif;
      margin-bottom: 24px;
      text-align: center;
      text-shadow: 0 0 16px rgba(0, 168, 247, 0.2);
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 18px;
      margin-bottom: 40px;
    }

    .kpi-card {
      background: linear-gradient(140deg, rgba(0, 168, 247, 0.12), rgba(255, 110, 199, 0.08), rgba(255, 255, 255, 0.84));
      padding: 25px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
      text-align: center;
      border-left: 4px solid var(--accent-cyan);
    }

    .kpi-label {
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 10px;
    }

    .kpi-unit {
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 18px;
      margin-bottom: 40px;
    }

    .chart-container {
      background: linear-gradient(140deg, rgba(0, 207, 164, 0.1), rgba(123, 141, 255, 0.09), rgba(255, 255, 255, 0.84));
      padding: 22px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
    }

    .chart-container,
    .sites-details,
    .kpi-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .chart-container:hover,
    .sites-details:hover,
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 34px rgba(0, 132, 216, 0.16);
    }

    .chart-container h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: var(--text);
      font-size: 16px;
    }

    .chart-container canvas {
      max-height: 300px;
    }

    .sites-details {
      background: linear-gradient(140deg, rgba(0, 168, 247, 0.08), rgba(255, 159, 67, 0.08), rgba(255, 255, 255, 0.86));
      padding: 22px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
    }

    .sites-details h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: var(--text);
      font-size: 16px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--muted);
    }

    .sites-table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden;
      border-radius: 12px;
    }

    .sites-table thead {
      background: linear-gradient(90deg, rgba(0, 168, 247, 0.16), rgba(0, 207, 164, 0.16), rgba(255, 159, 67, 0.14));
      border-bottom: 1px solid rgba(0, 168, 247, 0.3);
    }

    .sites-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: var(--text);
      font-size: 14px;
    }

    .sites-table td {
      padding: 15px;
      border-bottom: 1px solid rgba(157, 182, 211, 0.2);
      color: var(--muted);
      font-size: 14px;
    }

    .sites-table tbody tr:hover {
      background: rgba(110, 233, 255, 0.08);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 15px;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .sites-table {
        font-size: 12px;
      }

      .sites-table th, .sites-table td {
        padding: 10px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  sites: any[] = [];
  loading = false;

  // KPI values
  totalCO2 = 0;
  sitesCount = 0;
  averageCO2 = 0;
  constructionRatio = 0;

  // Chart types
  chartTypes: { bar: 'bar'; pie: 'pie' } = {
    bar: 'bar',
    pie: 'pie'
  };

  // Bar Chart
  barChartData: any = {
    labels: [],
    datasets: [{
      label: 'CO₂ Total (kg)',
      data: [],
      backgroundColor: 'rgba(123, 141, 255, 0.75)',
      borderColor: 'rgba(105, 122, 240, 1)',
      borderWidth: 1
    }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  barChartPlugins = [];

  // Pie Chart
  pieChartData: any = {
    labels: ['Construction', 'Exploitation'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(0, 168, 247, 0.78)',
        'rgba(255, 110, 199, 0.78)'
      ],
      borderColor: [
        'rgba(0, 148, 226, 1)',
        'rgba(232, 88, 179, 1)'
      ],
      borderWidth: 2
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
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
    
    if (this.sites.length === 0) {
      this.totalCO2 = 0;
      this.averageCO2 = 0;
      this.constructionRatio = 0;
      return;
    }

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
    // Update bar chart
    this.barChartData.labels = this.sites.map(s => s.name);
    this.barChartData.datasets[0].data = this.sites.map(s => s.totalCO2 || 0);
  }
}

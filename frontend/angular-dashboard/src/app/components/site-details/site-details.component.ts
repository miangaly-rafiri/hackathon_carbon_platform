import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-site-details',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="details-container">
      <div *ngIf="loading" class="loading">
        Chargement des données...
      </div>

      <div *ngIf="!loading && site">
        <div class="site-header">
          <h1>{{ site.name }}</h1>
        </div>

        <!-- KPI du site -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Surface</div>
            <div class="kpi-value">{{ site.surface | number:'1.0-0' }}</div>
            <div class="kpi-unit">m²</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Employés</div>
            <div class="kpi-value">{{ site.employees }}</div>
            <div class="kpi-unit">personnes</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Consommation énergétique</div>
            <div class="kpi-value">{{ site.energyMWh | number:'1.0-0' }}</div>
            <div class="kpi-unit">MWh/an</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-label">Places de parking</div>
            <div class="kpi-value">{{ site.parkingSpaces }}</div>
            <div class="kpi-unit">places</div>
          </div>
        </div>

        <!-- Carbon KPI -->
        <div class="carbon-kpi">
          <div class="carbon-card primary">
            <div class="label">CO₂ Total</div>
            <div class="value">{{ site.totalCO2 | number:'1.0-0' }}</div>
            <div class="unit">kg CO₂e</div>
          </div>

          <div class="carbon-card">
            <div class="label">CO₂ Construction</div>
            <div class="value">{{ site.constructionCO2 | number:'1.0-0' }}</div>
            <div class="unit">kg CO₂e</div>
            <div class="percentage">{{ (site.constructionCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</div>
          </div>

          <div class="carbon-card">
            <div class="label">CO₂ Exploitation</div>
            <div class="value">{{ site.operationCO2 | number:'1.0-0' }}</div>
            <div class="unit">kg CO₂e</div>
            <div class="percentage">{{ (site.operationCO2 / site.totalCO2 * 100) | number:'1.0-0' }}%</div>
          </div>

          <div class="carbon-card">
            <div class="label">CO₂ par m²</div>
            <div class="value">{{ (site.totalCO2 / site.surface) | number:'1.0-0' }}</div>
            <div class="unit">kg/m²</div>
          </div>

          <div class="carbon-card">
            <div class="label">CO₂ par employé</div>
            <div class="value">{{ (site.totalCO2 / site.employees) | number:'1.0-0' }}</div>
            <div class="unit">kg/emp</div>
          </div>
        </div>

        <!-- Graphique répartition -->
        <div class="chart-section">
          <div class="chart-container">
            <h3>Répartition CO₂ : Construction vs Exploitation</h3>
            <canvas 
              baseChart
              [type]="chartType"
              [data]="pieChartData"
              [options]="chartOptions"
            ></canvas>
          </div>

          <div class="chart-container">
            <h3>Matériaux de construction (tonnes)</h3>
            <div class="materials-list">
              <div class="material-item" *ngIf="site.concreteTons > 0">
                <span>Béton</span>
                <div class="bar">
                  <div class="fill" [style.width.%]="(site.concreteTons / maxMaterial * 100)"></div>
                </div>
                <span>{{ site.concreteTons }} t</span>
              </div>
              <div class="material-item" *ngIf="site.steelTons > 0">
                <span>Acier</span>
                <div class="bar">
                  <div class="fill" [style.width.%]="(site.steelTons / maxMaterial * 100)"></div>
                </div>
                <span>{{ site.steelTons }} t</span>
              </div>
              <div class="material-item" *ngIf="site.glassTons > 0">
                <span>Verre</span>
                <div class="bar">
                  <div class="fill" [style.width.%]="(site.glassTons / maxMaterial * 100)"></div>
                </div>
                <span>{{ site.glassTons }} t</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Historique CO2 -->
        <div class="history-section">
          <h3>Historique des calculs</h3>
          <div *ngIf="history.length === 0" class="no-history">
            Aucun historique disponible
          </div>
          <table *ngIf="history.length > 0" class="history-table">
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
                <td>{{ record.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ record.totalCO2 | number:'1.0-0' }}</td>
                <td>{{ record.constructionCO2 | number:'1.0-0' }}</td>
                <td>{{ record.operationCO2 | number:'1.0-0' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-container {
      padding: 30px;
      background: transparent;
      min-height: 100vh;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: var(--muted);
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
    }

    .site-header {
      background: linear-gradient(135deg, rgba(0, 168, 247, 0.2), rgba(123, 141, 255, 0.16), rgba(255, 110, 199, 0.12));
      border: 1px solid var(--line);
      color: var(--text);
      padding: 30px;
      border-radius: var(--radius-lg);
      margin-bottom: 30px;
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
    }

    .site-header h1 {
      margin: 0;
      font-size: 32px;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .kpi-card {
      background: linear-gradient(145deg, rgba(0, 168, 247, 0.1), rgba(255, 255, 255, 0.86));
      padding: 20px;
      border-radius: 14px;
      border: 1px solid rgba(110, 233, 255, 0.2);
      box-shadow: var(--shadow-lg);
      text-align: center;
    }

    .kpi-label {
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 5px;
    }

    .kpi-unit {
      font-size: 12px;
      color: var(--muted);
    }

    /* Carbon KPI */
    .carbon-kpi {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .carbon-card {
      background: linear-gradient(145deg, rgba(0, 207, 164, 0.1), rgba(255, 255, 255, 0.86));
      padding: 20px;
      border-radius: 14px;
      box-shadow: var(--shadow-lg);
      border-left: 4px solid var(--accent-cyan);
      border-top: 1px solid rgba(110, 233, 255, 0.2);
      text-align: center;
    }

    .carbon-card.primary {
      border-left-width: 6px;
      background: linear-gradient(135deg, rgba(0, 168, 247, 0.22) 0%, rgba(123, 141, 255, 0.16) 56%, rgba(255, 110, 199, 0.14) 100%);
    }

    .carbon-card .label {
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 10px;
    }

    .carbon-card .value {
      font-size: 28px;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 5px;
    }

    .carbon-card .unit {
      font-size: 12px;
      color: var(--muted);
    }

    .carbon-card .percentage {
      font-size: 14px;
      color: var(--accent-amber);
      margin-top: 10px;
      font-weight: 600;
    }

    /* Charts */
    .chart-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-container {
      background: linear-gradient(145deg, rgba(123, 141, 255, 0.1), rgba(0, 207, 164, 0.09), rgba(255, 255, 255, 0.86));
      padding: 25px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
    }

    .chart-container h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: var(--text);
      font-size: 16px;
    }

    .chart-container canvas {
      max-height: 250px;
    }

    .materials-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .material-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .material-item span:first-child {
      min-width: 60px;
      color: var(--muted);
      font-weight: 500;
    }

    .material-item .bar {
      flex: 1;
      height: 24px;
      background: rgba(220, 236, 252, 0.72);
      border-radius: 5px;
      overflow: hidden;
    }

    .material-item .fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-teal));
      transition: width 0.3s;
    }

    .material-item span:last-child {
      min-width: 50px;
      text-align: right;
      color: var(--accent-cyan);
      font-weight: 600;
    }

    /* History */
    .history-section {
      background: linear-gradient(145deg, rgba(0, 168, 247, 0.09), rgba(255, 159, 67, 0.08), rgba(255, 255, 255, 0.86));
      padding: 25px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
    }

    .history-section h3 {
      margin-top: 0;
      margin-bottom: 20px;
      color: var(--text);
      font-size: 16px;
    }

    .no-history {
      text-align: center;
      padding: 40px;
      color: var(--muted);
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;
    }

    .history-table thead {
      background: linear-gradient(90deg, rgba(0, 168, 247, 0.16), rgba(0, 207, 164, 0.16), rgba(255, 159, 67, 0.14));
      border-bottom: 1px solid rgba(0, 168, 247, 0.3);
    }

    .history-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: var(--text);
      font-size: 14px;
    }

    .history-table td {
      padding: 12px 15px;
      border-bottom: 1px solid rgba(157, 182, 211, 0.2);
      color: var(--muted);
      font-size: 14px;
    }

    .history-table tbody tr:hover {
      background: rgba(110, 233, 255, 0.08);
    }

    @media (max-width: 768px) {
      .details-container {
        padding: 15px;
      }

      .site-header h1 {
        font-size: 24px;
      }

      .kpi-grid, .carbon-kpi {
        grid-template-columns: repeat(2, 1fr);
      }

      .chart-section {
        grid-template-columns: 1fr;
      }
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
      backgroundColor: [
        'rgba(0, 168, 247, 0.8)',
        'rgba(255, 110, 199, 0.8)'
      ],
      borderColor: [
        'rgba(0, 148, 226, 1)',
        'rgba(232, 88, 179, 1)'
      ],
      borderWidth: 2
    }]
  };

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private siteService: SiteService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const siteId = params['id'];
      if (siteId) {
        this.loadSiteDetails(siteId);
      }
    });
  }

  loadSiteDetails(id: number): void {
    this.loading = true;

    this.siteService.getSiteById(id).subscribe({
      next: (data) => {
        this.site = data;
        this.maxMaterial = Math.max(
          this.site.concreteTons || 1,
          this.site.steelTons || 1,
          this.site.glassTons || 1
        );
        this.updateChart();
        this.loadHistory(id);
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHistory(id: number): void {
    this.siteService.getCarbonHistory(id).subscribe({
      next: (data) => {
        this.history = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.history = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateChart(): void {
    this.pieChartData.datasets[0].data = [
      this.site.constructionCO2 || 0,
      this.site.operationCO2 || 0
    ];
  }
}

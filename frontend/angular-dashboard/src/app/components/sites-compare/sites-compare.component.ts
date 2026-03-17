import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from '../../services/site.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sites-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="compare-container">
      <div class="compare-card">
        <h2>Comparer deux sites</h2>

        <div class="selectors">
          <div class="selector-group">
            <label for="siteA">Site A</label>
            <select id="siteA" [(ngModel)]="siteAId" name="siteAId">
              <option [ngValue]="null">Selectionner un site</option>
              <option *ngFor="let site of sites" [ngValue]="site.id">{{ site.name }}</option>
            </select>
          </div>

          <div class="selector-group">
            <label for="siteB">Site B</label>
            <select id="siteB" [(ngModel)]="siteBId" name="siteBId">
              <option [ngValue]="null">Selectionner un site</option>
              <option *ngFor="let site of sites" [ngValue]="site.id">{{ site.name }}</option>
            </select>
          </div>

          <button class="btn-primary" (click)="compare()" [disabled]="loading">
            {{ loading ? 'Comparaison...' : 'Comparer' }}
          </button>
        </div>

        <div *ngIf="error" class="error-message">{{ error }}</div>

        <div *ngIf="comparison" class="compare-tools">
          <div class="selector-group">
            <label for="chartType">Type de graphique</label>
            <select id="chartType" [(ngModel)]="selectedChartType" (ngModelChange)="updateChartData()">
              <option value="bar">Barres</option>
              <option value="pie">Pie</option>
              <option value="radar">Radar</option>
            </select>
          </div>

          <button class="btn-secondary" (click)="exportPdf()">Exporter PDF</button>
        </div>

        <div *ngIf="comparison" class="chart-box">
          <canvas
            baseChart
            [type]="selectedChartType"
            [data]="comparisonChartData"
            [options]="comparisonChartOptions"
          ></canvas>
        </div>

        <div *ngIf="comparison" class="result-table-wrap">
          <table class="result-table">
            <thead>
              <tr>
                <th>Indicateur</th>
                <th>{{ comparison.siteA.siteName }}</th>
                <th>{{ comparison.siteB.siteName }}</th>
                <th>Difference (A - B)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CO2 total (kg)</td>
                <td>{{ comparison.siteA.totalCO2 | number:'1.0-0' }}</td>
                <td>{{ comparison.siteB.totalCO2 | number:'1.0-0' }}</td>
                <td [class.positive]="comparison.differences.totalCO2 > 0" [class.negative]="comparison.differences.totalCO2 < 0">
                  {{ comparison.differences.totalCO2 | number:'1.0-0' }}
                </td>
              </tr>
              <tr>
                <td>CO2 construction (kg)</td>
                <td>{{ comparison.siteA.constructionCO2 | number:'1.0-0' }}</td>
                <td>{{ comparison.siteB.constructionCO2 | number:'1.0-0' }}</td>
                <td [class.positive]="comparison.differences.constructionCO2 > 0" [class.negative]="comparison.differences.constructionCO2 < 0">
                  {{ comparison.differences.constructionCO2 | number:'1.0-0' }}
                </td>
              </tr>
              <tr>
                <td>CO2 exploitation (kg)</td>
                <td>{{ comparison.siteA.operationCO2 | number:'1.0-0' }}</td>
                <td>{{ comparison.siteB.operationCO2 | number:'1.0-0' }}</td>
                <td [class.positive]="comparison.differences.operationCO2 > 0" [class.negative]="comparison.differences.operationCO2 < 0">
                  {{ comparison.differences.operationCO2 | number:'1.0-0' }}
                </td>
              </tr>
              <tr>
                <td>CO2/m2 (kg)</td>
                <td>{{ comparison.siteA.co2PerSqm | number:'1.0-2' }}</td>
                <td>{{ comparison.siteB.co2PerSqm | number:'1.0-2' }}</td>
                <td [class.positive]="comparison.differences.co2PerSqm > 0" [class.negative]="comparison.differences.co2PerSqm < 0">
                  {{ comparison.differences.co2PerSqm | number:'1.0-2' }}
                </td>
              </tr>
              <tr>
                <td>CO2/employe (kg)</td>
                <td>{{ comparison.siteA.co2PerEmployee | number:'1.0-2' }}</td>
                <td>{{ comparison.siteB.co2PerEmployee | number:'1.0-2' }}</td>
                <td [class.positive]="comparison.differences.co2PerEmployee > 0" [class.negative]="comparison.differences.co2PerEmployee < 0">
                  {{ comparison.differences.co2PerEmployee | number:'1.0-2' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .compare-container {
      padding: 20px;
      min-height: 100vh;
      background: transparent;
    }

    .compare-card {
      background: linear-gradient(145deg, rgba(0, 168, 247, 0.11), rgba(123, 141, 255, 0.09), rgba(255, 255, 255, 0.9));
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: 24px;
    }

    h2 {
      margin-top: 0;
      color: var(--text);
      font-family: 'Orbitron', sans-serif;
    }

    .selectors {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      align-items: end;
      margin-bottom: 18px;
    }

    .selector-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    select {
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(110, 233, 255, 0.24);
      background: #ffffff;
      color: #1f2a37;
      font-weight: 600;
      -webkit-text-fill-color: #1f2a37;
    }

    select:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 4px rgba(110, 233, 255, 0.18);
    }

    option {
      background: #ffffff;
      color: #1f2a37;
    }

    .btn-primary {
      padding: 11px 22px;
      border: 2px solid rgba(255, 255, 255, 0.65);
      border-radius: 999px;
      cursor: pointer;
      color: #ffffff;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      font-weight: 600;
      box-shadow: 0 0 0 3px rgba(0, 168, 247, 0.18), 0 10px 22px rgba(123, 141, 255, 0.28);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 0 0 4px rgba(0, 168, 247, 0.22), 0 12px 26px rgba(123, 141, 255, 0.34);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      margin: 12px 0;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid rgba(255, 127, 146, 0.35);
      background: rgba(255, 127, 146, 0.13);
      color: #a12b46;
    }

    .result-table-wrap {
      overflow-x: auto;
    }

    .compare-tools {
      display: flex;
      gap: 12px;
      align-items: end;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .chart-box {
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(110, 233, 255, 0.24);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 14px;
    }

    .chart-box canvas {
      max-height: 320px;
    }

    .btn-secondary {
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid rgba(157, 182, 211, 0.45);
      background: rgba(157, 182, 211, 0.22);
      color: var(--text);
      font-weight: 600;
      cursor: pointer;
    }

    .btn-secondary:hover {
      background: rgba(157, 182, 211, 0.3);
    }

    .result-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 680px;
    }

    .result-table thead {
      background: linear-gradient(90deg, rgba(0, 168, 247, 0.16), rgba(0, 207, 164, 0.16), rgba(255, 159, 67, 0.14));
    }

    .result-table th,
    .result-table td {
      padding: 12px;
      border-bottom: 1px solid rgba(157, 182, 211, 0.2);
      text-align: left;
      color: var(--text);
    }

    .positive {
      color: #c74e4e;
      font-weight: 600;
    }

    .negative {
      color: #1c7d5a;
      font-weight: 600;
    }
  `]
})
export class SitesCompareComponent implements OnInit {
  sites: any[] = [];
  siteAId: number | null = null;
  siteBId: number | null = null;
  comparison: any = null;
  loading = false;
  error = '';
  selectedChartType: 'bar' | 'pie' | 'radar' = 'bar';
  comparisonChartData: any = {
    labels: [],
    datasets: []
  };

  comparisonChartOptions: ChartConfiguration<'bar' | 'pie' | 'radar'>['options'] = {
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.siteService.getAllSites().subscribe({
      next: (sites) => {
        this.sites = sites;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Impossible de charger la liste des sites';
        this.cdr.detectChanges();
      }
    });
  }

  compare(): void {
    if (!this.siteAId || !this.siteBId) {
      this.error = 'Veuillez selectionner deux sites';
      return;
    }

    if (this.siteAId === this.siteBId) {
      this.error = 'Veuillez selectionner deux sites differents';
      return;
    }

    this.loading = true;
    this.error = '';
    this.comparison = null;

    this.siteService.compareSites(this.siteAId, this.siteBId).subscribe({
      next: (data) => {
        this.comparison = data;
        this.updateChartData();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur pendant la comparaison des sites';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateChartData(): void {
    if (!this.comparison) {
      return;
    }

    const siteA = this.comparison.siteA;
    const siteB = this.comparison.siteB;

    if (this.selectedChartType === 'pie') {
      this.comparisonChartData = {
        labels: [siteA.siteName, siteB.siteName],
        datasets: [{
          data: [siteA.totalCO2, siteB.totalCO2],
          backgroundColor: ['rgba(0, 168, 247, 0.78)', 'rgba(255, 159, 67, 0.78)'],
          borderColor: ['rgba(0, 148, 226, 1)', 'rgba(235, 130, 22, 1)'],
          borderWidth: 2
        }]
      };
      return;
    }

    this.comparisonChartData = {
      labels: ['CO2 total', 'Construction', 'Exploitation', 'CO2/m2', 'CO2/employe'],
      datasets: [
        {
          label: siteA.siteName,
          data: [siteA.totalCO2, siteA.constructionCO2, siteA.operationCO2, siteA.co2PerSqm, siteA.co2PerEmployee],
          backgroundColor: 'rgba(0, 168, 247, 0.35)',
          borderColor: 'rgba(0, 148, 226, 1)',
          borderWidth: 2,
          fill: this.selectedChartType === 'radar'
        },
        {
          label: siteB.siteName,
          data: [siteB.totalCO2, siteB.constructionCO2, siteB.operationCO2, siteB.co2PerSqm, siteB.co2PerEmployee],
          backgroundColor: 'rgba(255, 159, 67, 0.28)',
          borderColor: 'rgba(235, 130, 22, 1)',
          borderWidth: 2,
          fill: this.selectedChartType === 'radar'
        }
      ]
    };
  }

  exportPdf(): void {
    if (!this.comparison) {
      return;
    }

    const doc = new jsPDF();
    const siteA = this.comparison.siteA;
    const siteB = this.comparison.siteB;
    const diff = this.comparison.differences;

    doc.setFontSize(14);
    doc.text('Comparaison de sites', 14, 15);
    doc.setFontSize(10);
    doc.text(`Site A: ${siteA.siteName} | Site B: ${siteB.siteName}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Indicateur', siteA.siteName, siteB.siteName, 'Difference (A - B)']],
      body: [
        ['CO2 total (kg)', siteA.totalCO2.toFixed(2), siteB.totalCO2.toFixed(2), diff.totalCO2.toFixed(2)],
        ['CO2 construction (kg)', siteA.constructionCO2.toFixed(2), siteB.constructionCO2.toFixed(2), diff.constructionCO2.toFixed(2)],
        ['CO2 exploitation (kg)', siteA.operationCO2.toFixed(2), siteB.operationCO2.toFixed(2), diff.operationCO2.toFixed(2)],
        ['CO2/m2 (kg)', siteA.co2PerSqm.toFixed(2), siteB.co2PerSqm.toFixed(2), diff.co2PerSqm.toFixed(2)],
        ['CO2/employe (kg)', siteA.co2PerEmployee.toFixed(2), siteB.co2PerEmployee.toFixed(2), diff.co2PerEmployee.toFixed(2)]
      ]
    });

    doc.save(`comparaison-${siteA.siteName}-${siteB.siteName}.pdf`);
  }
}

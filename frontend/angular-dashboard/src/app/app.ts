import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/sites';

  protected readonly title = 'Carbon Dashboard';
  protected readonly sites = signal<SiteView[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly saveMessage = signal('');

  protected readonly form = signal<SitePayload>({
    name: '',
    surface: 0,
    parkingSpaces: 0,
    energyMWh: 0,
    employees: 0,
    concreteTons: 0,
    steelTons: 0,
    glassTons: 0,
    woodTons: 0
  });

  protected readonly totalCo2 = computed(() =>
    this.sites().reduce((sum, site) => sum + site.totalCO2, 0)
  );

  protected readonly totalSurface = computed(() =>
    this.sites().reduce((sum, site) => sum + site.surface, 0)
  );

  protected readonly averageCo2PerEmployee = computed(() => {
    const employees = this.sites().reduce((sum, site) => sum + site.employees, 0);
    return employees ? this.totalCo2() / employees : 0;
  });

  protected readonly co2PerSquareMeter = computed(() => {
    const surface = this.totalSurface();
    return surface ? this.totalCo2() / surface : 0;
  });

  protected readonly totalConstruction = computed(() =>
    this.sites().reduce((sum, site) => sum + site.constructionCO2, 0)
  );

  protected readonly totalOperation = computed(() =>
    this.sites().reduce((sum, site) => sum + site.operationCO2, 0)
  );

  protected readonly chartMax = computed(() =>
    Math.max(...this.sites().map((site) => site.totalCO2), 1)
  );

  protected readonly sortedSites = computed(() =>
    [...this.sites()].sort((a, b) => a.totalCO2 - b.totalCO2)
  );

  public ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http.get<SiteView[]>(this.apiUrl)
      .pipe(timeout(5000))
      .subscribe({
        next: (data) => {
          this.sites.set(data ?? []);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Backend indisponible ou réponse trop lente (>5s).');
          this.isLoading.set(false);
        }
      });
  }

  protected updateText(field: 'name', value: string): void {
    this.form.update((current) => ({
      ...current,
      [field]: value
    }));
  }

  protected updateNumber(field: NumberField, value: string): void {
    const parsed = Number(value);

    this.form.update((current) => ({
      ...current,
      [field]: Number.isFinite(parsed) ? parsed : 0
    }));
  }

  protected createSite(): void {
    const payload = this.form();

    if (!payload.name.trim()) {
      this.saveMessage.set('Le nom du site est obligatoire.');
      return;
    }

    this.isSaving.set(true);
    this.saveMessage.set('');

    this.http.post<SiteView>(this.apiUrl, payload)
      .pipe(timeout(5000))
      .subscribe({
        next: (created) => {
          this.sites.update((current) => [created, ...current]);
          this.isSaving.set(false);
          this.saveMessage.set('Site ajouté avec succès.');
          this.form.set({
            name: '',
            surface: 0,
            parkingSpaces: 0,
            energyMWh: 0,
            employees: 0,
            concreteTons: 0,
            steelTons: 0,
            glassTons: 0,
            woodTons: 0
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.saveMessage.set('Impossible de créer le site pour le moment.');
        }
      });
  }

  protected barWidth(value: number): number {
    return (value / this.chartMax()) * 100;
  }
}

type SiteView = {
  id?: number;
  name: string;
  surface: number;
  parkingSpaces: number;
  energyMWh: number;
  employees: number;
  concreteTons: number;
  steelTons: number;
  glassTons: number;
  woodTons: number;
  constructionCO2: number;
  operationCO2: number;
  totalCO2: number;
};

type SitePayload = {
  name: string;
  surface: number;
  parkingSpaces: number;
  energyMWh: number;
  employees: number;
  concreteTons: number;
  steelTons: number;
  glassTons: number;
  woodTons: number;
};

type NumberField = Exclude<keyof SitePayload, 'name'>;

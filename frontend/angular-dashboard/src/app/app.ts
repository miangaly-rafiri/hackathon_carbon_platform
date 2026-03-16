import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly title = 'Carbon Dashboard';
  protected sites: SiteView[] = [];
  protected isLoading = false;
  protected errorMessage = '';

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const data = await this.http
        .get<SiteView[]>('http://localhost:8080/api/sites')
        .toPromise();

      this.sites = data ?? [];
    } catch {
      this.errorMessage = 'Impossible de charger les sites depuis le backend.';
    } finally {
      this.isLoading = false;
    }
  }

  protected totalCo2(): number {
    return this.sites.reduce((sum, site) => sum + site.totalCO2, 0);
  }

  protected averageCo2PerEmployee(): number {
    const employees = this.sites.reduce((sum, site) => sum + site.employees, 0);

    if (!employees) {
      return 0;
    }

    return this.totalCo2() / employees;
  }
}

type SiteView = {
  name: string;
  surface: number;
  employees: number;
  totalCO2: number;
};

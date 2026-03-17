import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private apiUrl = 'http://localhost:8080/api/sites';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllSites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSiteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createSite(site: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, site, { headers: this.getHeaders() });
  }

  updateSite(id: number, site: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, site, { headers: this.getHeaders() });
  }

  deleteSite(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCarbonData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/carbon`, { headers: this.getHeaders() });
  }

  getCarbonHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/history`, { headers: this.getHeaders() });
  }

  compareSites(siteAId: number, siteBId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/compare?siteAId=${siteAId}&siteBId=${siteBId}`, { headers: this.getHeaders() });
  }

  addMaterial(siteId: number, material: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${siteId}/materials`, material, { headers: this.getHeaders() });
  }

  getMaterials(siteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${siteId}/materials`, { headers: this.getHeaders() });
  }

  deleteMaterial(siteId: number, materialId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${siteId}/materials/${materialId}`, { headers: this.getHeaders() });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule],
  template: `
    <div class="app-container">
      <!-- Navbar -->
      <nav class="navbar" *ngIf="isAuthenticated$ | async">
        <div class="nav-content">
          <div class="nav-brand">
            <h1>🌍 Platform Carbone</h1>
          </div>

          <ul class="nav-menu">
            <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
            <li><a routerLink="/sites" routerLinkActive="active">Sites</a></li>
          </ul>

          <div class="nav-user">
            <span *ngIf="currentUser$ | async as user">{{ user.email }}</span>
            <button class="btn-logout" (click)="logout()">Déconnexion</button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer" *ngIf="isAuthenticated$ | async">
        <p>&copy; 2026 Platform Carbone - Hackathon Sup de Vinci - Capgemini</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      color: var(--text);
    }

    .navbar {
      background:
        linear-gradient(90deg, rgba(0, 168, 247, 0.12), rgba(255, 110, 199, 0.1), rgba(0, 207, 164, 0.12)),
        rgba(255, 255, 255, 0.76);
      border-bottom: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 74px;
    }

    .nav-brand h1 {
      margin: 0;
      font-family: 'Orbitron', sans-serif;
      font-size: 22px;
      font-weight: 700;
      background: linear-gradient(120deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 12px rgba(0, 168, 247, 0.2);
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 30px;
    }

    .nav-menu a {
      color: var(--muted);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.25s ease;
      padding: 10px 16px;
      border-radius: 999px;
      border: 1px solid transparent;
    }

    .nav-menu a:hover {
      color: var(--text);
      background: linear-gradient(135deg, rgba(0, 168, 247, 0.14), rgba(255, 110, 199, 0.12));
      border-color: rgba(0, 168, 247, 0.32);
    }

    .nav-menu a.active {
      color: #ffffff;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      box-shadow: 0 8px 18px rgba(123, 141, 255, 0.32);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .nav-user span {
      font-size: 14px;
      color: var(--muted);
    }

    .btn-logout {
      padding: 9px 16px;
      background: rgba(240, 104, 127, 0.12);
      color: #b9304e;
      border: 1px solid rgba(240, 104, 127, 0.3);
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      transform: translateY(-1px);
      background: rgba(240, 104, 127, 0.2);
      box-shadow: 0 8px 16px rgba(240, 104, 127, 0.16);
    }

    .main-content {
      flex: 1;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 14px 20px 28px;
    }

    .footer {
      background:
        linear-gradient(90deg, rgba(0, 168, 247, 0.1), rgba(0, 207, 164, 0.1), rgba(255, 159, 67, 0.1)),
        rgba(255, 255, 255, 0.72);
      border-top: 1px solid var(--line);
      color: var(--muted);
      text-align: center;
      padding: 20px;
      margin-top: 40px;
      font-size: 14px;
      backdrop-filter: blur(8px);
    }

    .footer p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .nav-content {
        flex-wrap: wrap;
        justify-content: center;
        height: auto;
        padding: 15px 10px;
      }

      .nav-brand h1 {
        font-size: 18px;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
      }

      .nav-menu {
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .nav-user {
        width: 100%;
        justify-content: center;
        margin-top: 10px;
      }

      .main-content {
        padding: 10px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.getAuthStatus();
    this.currentUser$ = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    // Si pas authentifié, rediriger vers login
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

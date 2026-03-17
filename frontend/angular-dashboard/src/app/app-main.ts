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
            <span class="brand-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="url(#ng)" stroke-width="1.5" fill="none"/>
                <path d="M14 6 C10 10, 8 14, 14 16 C20 14, 18 10, 14 6Z" fill="url(#ng)" opacity="0.9"/>
                <path d="M14 16 L14 22" stroke="url(#ng)" stroke-width="2" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="ng" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#00e676"/>
                    <stop offset="100%" stop-color="#00bfa5"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <h1>Plateforme Carbone</h1>
          </div>

          <ul class="nav-menu">
            <li>
              <a routerLink="/dashboard" routerLinkActive="active">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                  <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a routerLink="/sites" routerLinkActive="active">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14 L2 6 L8 2 L14 6 L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="5.5" y="9" width="5" height="5" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Sites
              </a>
            </li>
          </ul>

          <div class="nav-user">
            <div class="user-pill" *ngIf="currentUser$ | async as user">
              <span class="user-dot"></span>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <button class="btn-logout" (click)="logout()">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M9 10l3-3-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="7" x2="5" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer" *ngIf="isAuthenticated$ | async">
        <div class="footer-inner">
          <span class="footer-brand">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6.25" stroke="#00e676" stroke-width="1"/>
              <path d="M7 3 C5 5, 4 7, 7 8 C10 7, 9 5, 7 3Z" fill="#00e676" opacity="0.8"/>
              <line x1="7" y1="8" x2="7" y2="11" stroke="#00e676" stroke-width="1.5"/>
            </svg>
            Plateforme Carbone
          </span>
          <span class="footer-sep">·</span>
          <span>Hackathon Sup de Vinci × Capgemini</span>
          <span class="footer-sep">·</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
      z-index: 1;
    }

    .navbar {
      background: rgba(6, 14, 9, 0.9);
      border-bottom: 1px solid rgba(0, 200, 90, 0.15);
      box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(0,230,118,0.08);
      backdrop-filter: blur(16px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 68px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      filter: drop-shadow(0 0 6px rgba(0,230,118,0.4));
    }

    .nav-brand h1 {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.08em;
      background: linear-gradient(120deg, #00e676, #1de9b6, #00bfa5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 6px;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      gap: 7px;
      color: var(--muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid transparent;
    }

    .nav-menu a:hover {
      color: var(--eco-green);
      background: rgba(0, 230, 118, 0.07);
      border-color: rgba(0, 230, 118, 0.18);
    }

    .nav-menu a.active {
      color: #060e09;
      background: linear-gradient(135deg, #00e676, #00bfa5);
      border-color: transparent;
      box-shadow: 0 4px 16px rgba(0, 230, 118, 0.3);
      font-weight: 600;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(0, 200, 90, 0.06);
      border: 1px solid rgba(0, 200, 90, 0.14);
      border-radius: 99px;
    }

    .user-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--eco-green);
      box-shadow: 0 0 6px rgba(0,230,118,0.7);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .user-email {
      font-size: 13px;
      color: var(--muted);
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(255, 82, 82, 0.08);
      color: rgba(255, 120, 120, 0.85);
      border: 1px solid rgba(255, 82, 82, 0.2);
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      background: rgba(255, 82, 82, 0.16);
      color: #ff6b6b;
      border-color: rgba(255, 82, 82, 0.35);
      transform: translateY(-1px);
    }

    .main-content {
      flex: 1;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 20px 24px 32px;
      position: relative;
      z-index: 1;
    }

    .footer {
      background: rgba(6, 14, 9, 0.85);
      border-top: 1px solid rgba(0, 200, 90, 0.12);
      color: var(--muted);
      padding: 16px 24px;
      backdrop-filter: blur(12px);
      margin-top: 20px;
    }

    .footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 13px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--eco-green);
      font-weight: 600;
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      letter-spacing: 0.04em;
    }

    .footer-sep {
      color: rgba(0,200,90,0.2);
    }

    @media (max-width: 768px) {
      .nav-content {
        flex-wrap: wrap;
        height: auto;
        padding: 12px 16px;
        gap: 10px;
      }

      .nav-brand h1 {
        font-size: 15px;
      }

      .nav-menu {
        order: 3;
        width: 100%;
        justify-content: center;
      }

      .nav-user {
        gap: 8px;
      }

      .user-email {
        display: none;
      }

      .main-content {
        padding: 12px 16px 24px;
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
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

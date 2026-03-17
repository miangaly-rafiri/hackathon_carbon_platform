import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <!-- Decorative background blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="login-wrapper">
        <!-- Logo / Brand -->
        <div class="brand-header">
          <div class="brand-logo">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" stroke="url(#lgg)" stroke-width="1.5" fill="rgba(0,230,118,0.05)"/>
              <path d="M22 9 C15 16, 13 22, 22 25 C31 22, 29 16, 22 9Z" fill="url(#lgg)"/>
              <path d="M22 25 L22 34" stroke="url(#lgg)" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="lgg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#00e676"/>
                  <stop offset="100%" stop-color="#00bfa5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="brand-name">CarbonTrack</h1>
          <p class="brand-tagline">Plateforme de suivi carbone</p>
        </div>

        <div class="login-card">
          <div class="card-top-bar"></div>

          <div class="card-body">
            <h2>Connexion</h2>
            <p class="card-subtitle">Accédez à votre espace de suivi</p>

            <form (ngSubmit)="login()">
              <div class="form-group">
                <label>Email</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M1.5 6l6.5 4 6.5-4" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                    placeholder="votre@email.com"
                  >
                </div>
              </div>

              <div class="form-group">
                <label>Mot de passe</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
                  </svg>
                  <input
                    type="password"
                    [(ngModel)]="password"
                    name="password"
                    required
                    placeholder="••••••••"
                  >
                </div>
              </div>

              <button type="submit" class="btn-primary" [disabled]="loading">
                <span *ngIf="!loading">Se connecter</span>
                <span *ngIf="loading" class="loading-text">
                  <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </span>
              </button>
            </form>

            <div *ngIf="error" class="error-message">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
                <line x1="7" y1="4" x2="7" y2="7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="7" cy="10" r="0.75" fill="currentColor"/>
              </svg>
              {{ error }}
            </div>

            <p class="register-link">
              Pas encore de compte ?
              <a (click)="goToRegister()">S'inscrire</a>
            </p>
          </div>
        </div>

        <div class="eco-badge">
          <span>🌱 Réduire l'empreinte carbone du bâtiment</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      position: relative;
      overflow: hidden;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    .blob-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(0,230,118,0.07) 0%, transparent 70%);
      top: -100px;
      left: -100px;
    }

    .blob-2 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(0,191,165,0.06) 0%, transparent 70%);
      bottom: -80px;
      right: -80px;
    }

    .login-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 100%;
      max-width: 420px;
    }

    .brand-header {
      text-align: center;
    }

    .brand-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 12px rgba(0,230,118,0.35));
    }

    .brand-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.1em;
      background: linear-gradient(120deg, #00e676, #1de9b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;
    }

    .brand-tagline {
      color: var(--muted);
      font-size: 13px;
      font-weight: 400;
    }

    .login-card {
      width: 100%;
      background: rgba(8, 22, 12, 0.9);
      border: 1px solid rgba(0, 200, 90, 0.18);
      border-radius: 18px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,230,118,0.08);
      backdrop-filter: blur(20px);
      overflow: hidden;
    }

    .card-top-bar {
      height: 3px;
      background: linear-gradient(90deg, #00e676, #1de9b6, #00bfa5);
    }

    .card-body {
      padding: 32px;
    }

    h2 {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-bright);
      margin-bottom: 4px;
      letter-spacing: 0.04em;
    }

    .card-subtitle {
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 28px;
    }

    .form-group {
      margin-bottom: 18px;
    }

    label {
      display: block;
      margin-bottom: 7px;
      font-weight: 500;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
      pointer-events: none;
    }

    input {
      width: 100%;
      padding: 12px 12px 12px 38px;
      background: rgba(0, 20, 10, 0.7);
      border: 1px solid rgba(0, 200, 90, 0.14);
      color: var(--text);
      border-radius: 10px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input::placeholder {
      color: rgba(77, 122, 92, 0.6);
    }

    input:focus {
      outline: none;
      border-color: rgba(0, 230, 118, 0.45);
      box-shadow: 0 0 0 3px rgba(0, 230, 118, 0.08), 0 0 12px rgba(0,230,118,0.1);
    }

    .btn-primary {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #00c853, #00bfa5);
      color: #060e09;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      margin-top: 8px;
      letter-spacing: 0.02em;
      box-shadow: 0 6px 20px rgba(0,200,83,0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(0,200,83,0.4);
    }

    .loading-text {
      display: flex;
      justify-content: center;
      gap: 5px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #060e09;
      animation: blink 1.2s infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 11px 14px;
      background: rgba(255, 82, 82, 0.08);
      color: rgba(255, 120, 120, 0.9);
      border: 1px solid rgba(255, 82, 82, 0.2);
      border-radius: 8px;
      font-size: 13px;
    }

    .register-link {
      text-align: center;
      margin-top: 20px;
      color: var(--muted);
      font-size: 13px;
    }

    .register-link a {
      color: var(--eco-green);
      cursor: pointer;
      font-weight: 600;
      margin-left: 4px;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .register-link a:hover {
      color: var(--eco-teal);
    }

    .eco-badge {
      color: rgba(77, 122, 92, 0.7);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Merci de remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

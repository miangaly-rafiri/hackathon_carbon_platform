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
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion Platform Carbone</h2>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              required
              placeholder="votre@email.com"
            >
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              required
              placeholder="Entrez votre mot de passe"
            >
          </div>

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <p class="register-link">
          Pas de compte ? <a (click)="goToRegister()">S'inscrire</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background: transparent;
    }

    .login-card {
      background: linear-gradient(150deg, rgba(0, 168, 247, 0.12), rgba(255, 110, 199, 0.1), rgba(255, 255, 255, 0.9));
      padding: 40px;
      border-radius: 22px;
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(10px);
      width: 100%;
      max-width: 430px;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      background: linear-gradient(120deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--muted);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    input {
      width: 100%;
      padding: 13px;
      border: 1px solid rgba(110, 233, 255, 0.22);
      background: rgba(255, 255, 255, 0.88);
      color: var(--text);
      border-radius: 12px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #7f98b7;
    }

    input:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 4px rgba(110, 233, 255, 0.18);
    }

    button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 22px rgba(44, 242, 201, 0.36);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      margin-top: 20px;
      padding: 12px;
      background: rgba(255, 127, 146, 0.12);
      color: #a12b46;
      border: 1px solid rgba(255, 127, 146, 0.32);
      border-radius: 12px;
      text-align: center;
    }

    .register-link {
      text-align: center;
      margin-top: 20px;
      color: var(--muted);
    }

    .register-link a {
      color: var(--accent-cyan);
      cursor: pointer;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
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
      error: (error) => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Créer un compte</h2>
        
        <form (ngSubmit)="register()">
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
              placeholder="Au moins 6 caractères"
            >
          </div>

          <div class="form-group">
            <label>Confirmer le mot de passe</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              required
              placeholder="Confirmer le mot de passe"
            >
          </div>

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Création en cours...' : "S'inscrire" }}
          </button>
        </form>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <p class="login-link">
          Déjà inscrit ? <a (click)="goToLogin()">Se connecter</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background: transparent;
    }

    .register-card {
      background: linear-gradient(150deg, rgba(0, 207, 164, 0.12), rgba(123, 141, 255, 0.1), rgba(255, 255, 255, 0.9));
      padding: 40px;
      border-radius: 22px;
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(10px);
      width: 100%;
      max-width: 440px;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
      font-family: 'Orbitron', sans-serif;
      font-size: 1.45rem;
      background: linear-gradient(120deg, var(--accent-teal), var(--accent-cyan), var(--accent-violet));
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
      background: linear-gradient(135deg, var(--accent-teal), var(--accent-cyan), var(--accent-violet));
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

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: var(--muted);
    }

    .login-link a {
      color: var(--accent-cyan);
      cursor: pointer;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'Merci de remplir tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error =
          error?.error?.message ||
          error?.error ||
          error?.message ||
          'Erreur lors de l\'inscription';
        this.loading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

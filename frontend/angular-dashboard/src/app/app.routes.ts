import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SiteListComponent } from './components/sites-list/sites-list.component';
import { SiteFormComponent } from './components/site-form/site-form.component';
import { SiteDetailsComponent } from './components/site-details/site-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ 
		path: 'dashboard', 
		component: DashboardComponent, 
		canActivate: [AuthGuard] 
	},
	{ 
		path: 'sites', 
		component: SiteListComponent, 
		canActivate: [AuthGuard] 
	},
	{ 
		path: 'sites/new', 
		component: SiteFormComponent, 
		canActivate: [AuthGuard] 
	},
	{ 
		path: 'sites/edit/:id', 
		component: SiteFormComponent, 
		canActivate: [AuthGuard] 
	},
	{ 
		path: 'sites/details/:id', 
		component: SiteDetailsComponent, 
		canActivate: [AuthGuard] 
	},
	{ path: '**', redirectTo: '/dashboard' }
];

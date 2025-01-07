import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'consumption',
    loadComponent: () =>
      import('./pages/consumption/consumption.page').then(
        (m) => m.ConsumptionPage
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.page').then((m) => m.ChatPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'appliance/add',
    loadComponent: () =>
      import('./pages/appliance/add/add.page').then((m) => m.AddPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'appliance/update/:id',
    loadComponent: () =>
      import('./pages/appliance/update/update.page').then((m) => m.UpdatePage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

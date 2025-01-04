import { Routes } from '@angular/router';
import { SalaryComponent } from './features/salary/salary.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  { path: 'salary', component: SalaryComponent },
  { path: 'dashboard', component: DashboardComponent },
];

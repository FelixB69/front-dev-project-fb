import { Routes } from '@angular/router';
import { SalaryComponent } from './features/salary/salary.component';
import { GraphsComponent } from './features/graphs/graphs.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: SalaryComponent,
  },
  { path: 'salary', component: SalaryComponent },
  { path: 'graphs', component: GraphsComponent },
];

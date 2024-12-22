import { Routes } from '@angular/router';
import { SalaireComponent } from './features/salaire/salaire.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'salaire',
    pathMatch: 'full',
  },
  { path: 'salaire', component: SalaireComponent },
];

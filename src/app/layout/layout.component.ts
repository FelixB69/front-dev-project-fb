import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          width: '250px',
        })
      ),
      state(
        'out',
        style({
          width: '0px',
        })
      ),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class LayoutComponent {
  menuState: string = 'in'; // État de la sidebar
  currentTitle: string = 'Dashboard'; // Titre par défaut

  constructor(private router: Router) {
    // Écouter les changements de route pour mettre à jour le titre
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateTitleBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }

  toggleSidebar() {
    this.menuState = this.menuState === 'in' ? 'out' : 'in';
  }

  updateTitleBasedOnRoute(url: string) {
    // Mettre à jour le titre en fonction de l'URL (ajustez selon vos routes)
    if (url.includes('dashboard')) {
      this.currentTitle = 'Dashboard';
    } else if (url.includes('salary')) {
      this.currentTitle = 'Salaires';
    } else {
      this.currentTitle = 'Accueil'; // Par défaut ou autre titre
    }
  }

  setTitle(title: string) {
    // Méthode manuelle pour définir le titre si nécessaire
    this.currentTitle = title;
  }
}

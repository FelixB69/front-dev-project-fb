import { Injectable } from '@angular/core';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  private addToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    const id = new Date().getTime();
    if (this.toasts.length >= 5) {
      this.toasts.shift(); // Supprimer le toast le plus ancien si nous avons plus de 5 toasts
    }
    this.toasts.push({ id, message, type });

    // Différer l'affichage du toast dans un cycle d'événement non bloquant
    setTimeout(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.dismissToast(id);
        }, 4000); // Durée d'affichage du toast
      });
    }, 100); // Retarder l'affichage du toast
  }

  success(message: string) {
    this.addToast(message, 'success');
  }

  error(message: string) {
    this.addToast(message, 'error');
  }

  warning(message: string) {
    this.addToast(message, 'warning');
  }

  info(message: string) {
    this.addToast(message, 'info');
  }

  dismissToast(id: number) {
    setTimeout(() => {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    }, 0);
  }
}

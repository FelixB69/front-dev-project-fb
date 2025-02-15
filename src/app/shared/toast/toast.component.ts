import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 space-y-4 z-50">
      <div
        *ngFor="let toast of toastService.toasts"
        class="flex items-center max-w-sm px-5 py-4 rounded-3xl shadow-lg border-l-4 toast-animation"
        [ngClass]="{
          'border-green bg-green/10 text-green': toast.type === 'success',
          'border-red bg-red-100 text-red': toast.type === 'error',
          'border-orange bg-orange/20 text-orange': toast.type === 'warning',
          'border-blue bg-blue/10 text-blue': toast.type === 'info'
        }"
      >
        <!-- Icône dynamique -->
        <span
          class="material-icons mr-3 text-2xl"
          [ngClass]="{
            'text-green': toast.type === 'success',
            'text-red': toast.type === 'error',
            'text-orange': toast.type === 'warning',
            'text-blue': toast.type === 'info'
          }"
        >
          {{ getIcon(toast.type) }}
        </span>

        <!-- Message -->
        <span class="flex-1 font-medium">
          {{ toast.message }}
        </span>

        <!-- Bouton de fermeture -->
        <button
          (click)="toastService.dismissToast(toast.id)"
          class="ml-4 flex items-center justify-center w-6 h-6 rounded-full bg-white/50 hover:bg-white transition"
        >
          <span class="material-icons text-sm text-gray-dark">close</span>
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getIcon(type: 'success' | 'error' | 'warning' | 'info'): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }
}

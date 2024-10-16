import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shelf-spotter';
  constructor(
    private updates: SwUpdate
  ) {
    if (this.updates.isEnabled) {
      setInterval(() => {
        this.updates.checkForUpdate().then((update) => {
          if (update) {
            const userConfirmed = confirm("Nova versão disponível! Deseja atualizar?");
            if (userConfirmed) {
              this.updates.activateUpdate().then(() => document.location.reload());
            }
          }
        });
      }, 300000);
    }
  }
}

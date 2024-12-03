import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private intervalId: any;

  start(callback: () => void): void {
    this.stop();
    this.intervalId = setInterval(callback, 60000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

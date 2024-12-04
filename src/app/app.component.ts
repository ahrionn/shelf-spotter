import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimerService } from './TimerService/timer.service';
import { HttpClient } from '@angular/common/http';
import { LoadingInicialService } from './LoadingService/loading-inicial.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  apiUrl = 'https://api-spotter.onrender.com';
  //apiUrl = 'http://localhost:3000';

  constructor(
    private timerService: TimerService,
    private http: HttpClient,
    private loadingInicialService: LoadingInicialService
  ) {}

  ngOnInit(): void {
    this.timerService.start(() => {
      // Atualiza lista de itens a cada minuto
      this.http.get<any[]>(`${this.apiUrl}/api/listaEstoque`).subscribe({
        next: (response) => {
          let itensEstoque: any = response.sort((a, b) => a.nome.localeCompare(b.nome));
          this.loadingInicialService.atualizarItensEstoque(itensEstoque);
          itensEstoque = JSON.stringify(itensEstoque);
          localStorage.setItem('itensEstoque', itensEstoque);
        },
        error: (error) => {
          console.error('Erro ao buscar itens do estoque.', error);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.timerService.stop();
  }
}

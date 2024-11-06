import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingInicialService } from '../LoadingService/loading-inicial.service';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css'
})
export class PaginaInicialComponent {

  isLoadingRequest: boolean = false;
  apiUrl = 'https://api-spotter.onrender.com';
  // apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router,
    private http: HttpClient, 
    private loadingInicialService: LoadingInicialService
  ) { }

  ngOnInit() {
    this.isLoadingRequest = true;
    this.http.get<any[]>(`${this.apiUrl}/api/listaEstoque`).subscribe({
      next: (response) => {
        this.isLoadingRequest = false;
        const itensEstoque = response.sort((a, b) => a.nome.localeCompare(b.nome));
        this.loadingInicialService.atualizarItensEstoque(itensEstoque);
      },
      error: (error) => {
        this.isLoadingRequest = false;
        console.error('Erro ao buscar itens do estoque.', error);
      }
    });
  }

  redirect(rota: string) {
    this.router.navigateByUrl(`/${rota}`);
  }

  redirectToConfigs() {
    this.router.navigateByUrl('/configs');
  }
}

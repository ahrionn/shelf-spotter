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
    let estoqueCache = localStorage.getItem('itensEstoque');
    if (estoqueCache === null || estoqueCache === undefined || estoqueCache === '') {
      this.isLoadingRequest = true;
      this.http.get<any[]>(`${this.apiUrl}/api/listaEstoque`).subscribe({
        next: (response) => {
          this.isLoadingRequest = false;
          let itensEstoque: any = response.sort((a, b) => a.nome.localeCompare(b.nome));
          this.loadingInicialService.atualizarItensEstoque(itensEstoque);
          itensEstoque = JSON.stringify(itensEstoque);
          localStorage.setItem('itensEstoque', itensEstoque);
        },
        error: (error) => {
          this.isLoadingRequest = false;
          console.error('Erro ao buscar itens do estoque.', error);
        }
      });
    } else {
      let itensEstoque = estoqueCache !== null ? JSON.parse(estoqueCache) : [];
      itensEstoque = itensEstoque.sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome));
      this.loadingInicialService.atualizarItensEstoque(itensEstoque);

      // Requisição inicial só pra "acordar"
      this.http.get(`${this.apiUrl}/api/listaEstoque`).subscribe({
        next: () => {
          this.isLoadingRequest = false;
          console.log('API acordada com sucesso');
        },
        error: (error) => {
          this.isLoadingRequest = false;
          console.error('Erro ao tentar acordar a API.', error);
        }
      });      
    }
  }

  redirect(rota: string) {
    this.router.navigateByUrl(`/${rota}`);
  }

  redirectToConfigs() {
    this.router.navigateByUrl('/configs');
  }
}

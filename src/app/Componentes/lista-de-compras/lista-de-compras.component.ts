import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lista-de-compras',
  templateUrl: './lista-de-compras.component.html',
  styleUrls: ['./lista-de-compras.component.css']
})
export class ListaDeComprasComponent {

  isLoadingRequest: boolean = false;
  itensAdicionais: string[] = [''];
  modalAberto: boolean = false;
  apiUrl = 'http://localhost:3000';
  itensEstoque: any;
  itensAEnviar: any;

  constructor(
    private router: Router, 
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/api/listaEstoque`).subscribe({
      next: (response) => {
        this.itensEstoque = response;
      },
      error: (error) => {
        console.error('Erro ao buscar itens do estoque.', error);
      }
    });
  }

  adicionarItem(event?: any): void {
    this.itensAdicionais.push(event.target.value);
  }

  enviarItens(enviarLista?: boolean): void {
    if (!this.modalAberto) {
      this.abrirModal();
      return;
    } 
    if (enviarLista) {
      this.modalAberto = false;
      this.itensAdicionais.splice(0,1);

      this.itensAEnviar = this.itensEstoque.filter((item: { nome: string; }) => {
        return this.itensAdicionais.includes(item.nome);
      });

      this.http.post<any>(`${this.apiUrl}/api/listaCompras`, this.itensAEnviar).subscribe({
        next: (response) => {
          console.log('Lista enviada com sucesso para a API:', response);
        },
        error: (error) => {
          console.error('Erro ao enviar lista para a API:', error);
        }
      });
      this.router.navigateByUrl('/recibo', { state: { itensAEnviar: this.itensAEnviar } });
      return;
    } else {
      this.modalAberto = false;
      return;
    }
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal(enviarLista: boolean) {
    this.enviarItens(enviarLista);
  }
}

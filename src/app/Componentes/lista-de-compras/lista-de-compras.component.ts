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
  itensAdicionais: string[][] = [['']];
  modalAberto: boolean = false;
  apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router, 
    private http: HttpClient,
  ) {}

  adicionarItem(event?: any): void {
    if (event.target.value !== '' || event.target.innerHTML === 'Adicionar Item' && this.itensAdicionais[this.itensAdicionais.length-1][0] !== '') {
      this.itensAdicionais.push(['']);
      setTimeout(() => {
        const lastIndex = this.itensAdicionais.length - 1;
        const lastItemId = 'item-' + lastIndex;
        const lastItem = document.getElementById(lastItemId);
        if (lastItem) {
          lastItem.focus();
        }
      });
    }
  }

  enviarItens(enviarLista?: boolean): void {
    if (!this.modalAberto) {
      this.abrirModal();
      return;
    } 
    if (enviarLista) {
      this.modalAberto = false;
      this.http.post<any>(`${this.apiUrl}/api/listaItens`, this.itensAdicionais).subscribe({
        next: (response) => {
          console.log('Lista enviada com sucesso para a API:', response);
        },
        error: (error) => {
          console.error('Erro ao enviar lista para a API:', error);
        }
      });
      this.router.navigateByUrl('/recibo', { state: { itensAdicionais: this.itensAdicionais } });
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

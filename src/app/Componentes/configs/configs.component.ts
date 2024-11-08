import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoadingInicialService } from '../../LoadingService/loading-inicial.service';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.css'
})
export class ConfigsComponent {

  modalAddItem!: boolean;
  modalSearchItem!: boolean;
  modalAberto: boolean = false;
  isLoadingRequest: boolean = false;
  apiUrl = 'https://api-spotter.onrender.com';
  //apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private loadingInicialService: LoadingInicialService
  ) { }

  redirectToMain() {
    this.router.navigateByUrl('/pagina-inicial');
  }

  onAddItem() {
    this.modalAddItem = true;
    this.modalAberto = true;
  }

  onSearchItem() {
    this.modalSearchItem = true;
    this.modalAberto = true;
  }

  onUpdateItem() {

  }

  onDeleteItem() {

  }

  fecharModal(objNewItem: any) {
    this.modalAddItem = false;
    this.modalSearchItem = false;
    if (objNewItem !== undefined) {
      this.modalAberto = false;
      this.isLoadingRequest = true;
      this.http.post<any>(`${this.apiUrl}/api/addItem`, objNewItem).subscribe({
        next: (responseAddItem) => {
          this.atualizaLista();
          this.toastr.show('Item adicionado com sucesso!');
        },
        error: (error) => {
          this.isLoadingRequest = false;
          console.error('Erro ao adicionar item.', error);
        }
      });
    } else {
      this.modalAberto = false;
    }
  }

  atualizaLista() {
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
  }

}

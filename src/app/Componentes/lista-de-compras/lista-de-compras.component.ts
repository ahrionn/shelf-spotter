import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-de-compras',
  templateUrl: './lista-de-compras.component.html',
  styleUrls: ['./lista-de-compras.component.css']
})
export class ListaDeComprasComponent {

  itensAEnviar: any;
  itensEstoque: any[] = [];
  itensAdicionais: string[] = [];
  itensFiltrados: Observable<string[]> | undefined;
  modalAberto: boolean = false;
  isLoadingRequest: boolean = false;
  formControl = new FormControl();
  apiUrl = 'https://long-tan-anemone-kit.cyclic.app/';

  constructor(
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.itensFiltrados = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit(): void {
    this.isLoadingRequest = true;
    this.http.get<any[]>(`${this.apiUrl}/api/listaEstoque`).subscribe({
      next: (response) => {
        this.isLoadingRequest = false;
        this.itensEstoque = response.sort((a, b) => a.nome.localeCompare(b.nome));
        this.inicializaItensFiltrados();
      },
      error: (error) => {
        this.isLoadingRequest = false;
        console.error('Erro ao buscar itens do estoque.', error);
      }
    });
  }

  private inicializaItensFiltrados(): void {
    this.itensFiltrados = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.itensEstoque
      .map(item => item.nome)
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  adicionarItem(): void {
    const itemSelecionado = this.formControl.value.trim();
    if (itemSelecionado && !this.itensAdicionais.includes(itemSelecionado)) {
      this.itensAdicionais.push(itemSelecionado);
    }
    this.formControl.setValue('');
  }

  removerItem(item: string): void {
    const index = this.itensAdicionais.indexOf(item);
    if (index !== -1) {
      this.itensAdicionais.splice(index, 1);
    }
  }

  enviarItens(enviarLista?: boolean): void {
    if (this.itensAdicionais.length === 0) {
      this.toastr.show('Seu carrinho está vazio!');
      return;
    }
    if (!this.modalAberto) {
      this.abrirModal();
      return;
    } 
    if (enviarLista) {
      this.modalAberto = false;
      this.itensAEnviar = this.itensEstoque.filter((item: { nome: string; }) => {
        return this.itensAdicionais.includes(item.nome);
      });
      this.isLoadingRequest = true;
      this.http.post<any>(`${this.apiUrl}/api/listaCompras`, this.itensAEnviar).subscribe({
        next: (response) => {
          this.isLoadingRequest = false;
          console.log('Lista enviada com sucesso para a API:', response);
        },
        error: (error) => {
          this.isLoadingRequest = false;
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

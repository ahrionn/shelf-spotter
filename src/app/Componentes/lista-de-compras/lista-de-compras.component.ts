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

  isOpen = false;
  itensAEnviar: any;
  itensEstoque: any[] = [];
  itensAdicionais: string[] = [];
  itensFiltrados: Observable<string[]> | undefined;
  modalAberto: boolean = false;
  isLoadingRequest: boolean = false;
  formControl = new FormControl();
  cacheItensEstoque: string | undefined;
  apiUrl = 'https://api-spotter.onrender.com';
  // apiUrl = 'http://localhost:3000';

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

    if (localStorage.getItem('itensEstoque')) {
      this.itensEstoque = JSON.parse(localStorage.getItem('itensEstoque') || '[]');
      return;
    }

    this.isLoadingRequest = true;
    this.http.get<any[]>(`${this.apiUrl}/api/listaEstoque`).subscribe({
      next: (response) => {
        this.isLoadingRequest = false;
        this.itensEstoque = response.sort((a, b) => a.nome.localeCompare(b.nome));

        // Guarda lista de estoque no cache
        this.cacheItensEstoque = JSON.stringify(this.itensEstoque);
        localStorage.setItem('itensEstoque', this.cacheItensEstoque);

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

  toggleList() {
    this.isOpen = !this.isOpen;
  }

  agruparItensPorCorredor(): any {
    const grupos: any = [];

    if (this.itensEstoque) {
      this.itensEstoque.forEach((item: any) => {
        const grupoExistente = grupos.find((grupo: any) => grupo.corredor === item.corredor);
        if (grupoExistente) {
          grupoExistente.itens.push(item);
        } else {
          grupos.push({ corredor: item.corredor, itens: [item] });
        }
      });
    }

    grupos.sort((a: any, b: any) => a.corredor - b.corredor);

    return grupos;
  }

  adicionarItem(): void {
    if (this.formControl.value === null || this.formControl.value === '') {
      this.toastr.show('Selecione um item');
      return;
    }
    const itemSelecionado = this.formControl.value.trim();
    if (itemSelecionado && !this.itensAdicionais.includes(itemSelecionado)) {
      this.itensAdicionais.push(itemSelecionado);
      this.toastr.success(`${itemSelecionado} adicionado(a)!`, '', {
        toastClass: 'ngx-toastr toast-success-custom',
        timeOut: 2000,
      });
      const element = document.getElementById('blinkingElement');
      if (element) {
        element.classList.add('blink');
        setTimeout(() => {
          element?.classList.remove('blink');
        }, 3000); 
      }
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
      this.toastr.show('Sua lista está vazia!');
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

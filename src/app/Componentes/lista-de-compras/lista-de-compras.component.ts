import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoadingInicialService } from '../../LoadingService/loading-inicial.service';

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
  multiplicadores: number[] = [];
  minhasListas: any[] = [];
  modalAberto: boolean = false;
  modalListaDeCompras!: boolean;
  isLoadingRequest: boolean = false;
  formControl = new FormControl();
  cacheItensEstoque: string | undefined;
  apiUrl = 'https://api-spotter.onrender.com';
  // apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService,
    private loadingInicialService: LoadingInicialService
  ) {
    this.itensFiltrados = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit() {
    if (window.history.state.listaSelecionada !== undefined) {
      this.loadingInicial();
    } else {
      this.loadingInicialService.itensEstoque$.subscribe((itens) => {
        this.itensEstoque = itens;
        this.inicializaItensFiltrados();
      });
    }
  }

  loadingInicial() {
    window.history.state.listaSelecionada.pop();
    this.itensAdicionais = window.history.state.listaSelecionada.map((item: { nome: any; }) => item.nome);
    window.history.state.listaSelecionada.forEach((item: { qtd: number; }) => {
      this.multiplicadores.push(item.qtd);
    });
    
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

        // Busca itensEstoque do cache quando o usuário estiver offline (mobile only);
        try {
          let estoqueCache = localStorage.getItem('itensEstoque');
          this.itensEstoque = estoqueCache !== null ? JSON.parse(estoqueCache) : [];
        } catch {}

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

    if (this.formControl.value === null || this.formControl.value === '') {
      return;
    }
    
    const itemSelecionado = this.formControl.value.trim();

    if (this.itensAdicionais.includes(itemSelecionado)) {
      let itemInput = document.getElementById('itemInput') as HTMLInputElement;
      itemInput.value = '';
      this.toastr.show('Item já adicionado.');
      return;
    }

    if (!this.itensEstoque.map((item: { nome: any; }) => item.nome).includes(itemSelecionado)) {
      let itemInput = document.getElementById('itemInput') as HTMLInputElement;
      itemInput.value = '';
      this.toastr.show('Não temos esse item em estoque :(');
      return;
    }

    if (itemSelecionado && !this.itensAdicionais.includes(itemSelecionado)) {
      this.itensAdicionais.push(itemSelecionado);
      this.multiplicadores.push(1);
    }
    this.formControl.setValue('');
  }

  removerItem(item: string): void {
    const index = this.itensAdicionais.indexOf(item);
    if (index !== -1) {
      this.itensAdicionais.splice(index, 1);
      this.multiplicadores.splice(index, 1);
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

      this.itensAEnviar.forEach((item: { index: number; nome: string; }) => {
        item.index = this.itensAdicionais.indexOf(item.nome);
      });

      this.itensAEnviar.forEach((item: { qtd: number; index: number }) => {
        item.qtd = this.multiplicadores[item.index];
      });

      // Salva lista no cache do navegador
      let storedListas = localStorage['minhasListas'];
      if (storedListas !== null && storedListas !== 'undefined' && storedListas !== undefined && storedListas !== '') {
        this.minhasListas = storedListas ? JSON.parse(storedListas) : [];
        this.itensAEnviar.push(this.timeStamp());
        this.minhasListas.push(this.itensAEnviar);
        if (this.minhasListas !== undefined && this.minhasListas !== null && this.minhasListas.length > 5) {
          this.minhasListas.splice(0, 1);
        }
        localStorage.setItem('minhasListas', JSON.stringify(this.minhasListas));
      } else {
        this.itensAEnviar.push(this.timeStamp());
        this.minhasListas.push(this.itensAEnviar);
        localStorage.setItem('minhasListas', JSON.stringify(this.minhasListas));
      }
      this.itensAEnviar.pop();

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

      this.router.navigateByUrl('/recibo', { state: { itensAEnviar: this.itensAEnviar }});
      return;
    } else {
      this.modalAberto = false;
      return;
    }
  }

  abrirModal() {
    this.modalListaDeCompras = true;
    this.modalAberto = true;
  }

  fecharModal(enviarLista: boolean) {
    this.modalListaDeCompras = false;
    this.enviarItens(enviarLista);
  }

  redirectToMain() {
    this.router.navigateByUrl('/pagina-inicial');
  }

  timeStamp() {
    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const diaDaSemana = diasDaSemana[hoje.getDay()];

    const horas = String(hoje.getHours()).padStart(2, '0');
    const minutos = String(hoje.getMinutes()).padStart(2, '0');

    const dataCompleta = `${dia}/${mes}/${ano} (${diaDaSemana}) ${horas}:${minutos}`;

    return dataCompleta;
  }

  subtractMultiply(index: number) {
    if (this.multiplicadores[index] === 1) {
      return;
    }
    this.multiplicadores[index] -= 1;
  }

  addMultiply(index: number) {
    this.multiplicadores[index] += 1;
  }

}

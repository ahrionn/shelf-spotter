import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {
  @Output() fechar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fecharAddItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() fecharSearchItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() fecharUpdateItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() fecharDeleteItem: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalMinhasListas!: boolean;
  @Input() modalAddItem!: boolean;
  @Input() modalSearchItem!: boolean;
  @Input() modalUpdateItem!: boolean;
  @Input() modalDeleteItem!: boolean;
  @Input() modalListaDeCompras!: boolean;
  @Input() listaSelecionada: any;

  newItemName!: string;
  newItemAisle!: number;
  newItemPrice!: string;
  searchItem!: any;
  searchItemName!: string;
  searchItemAisle!: string;
  searchItemPrice!: string;
  updateItemID!: number;
  updateItemName!: string;
  updateItemAisle!: number;
  updateItemPrice!: string;
  deleteItemID!: number;
  deleteItemName!: string;
  deleteItemAisle!: number;
  deleteItemPrice!: string;
  formControl = new FormControl();
  itensEstoque!: any;
  itensFiltrados: Observable<string[]> | undefined;
  isLoadingRequest: boolean = false;
  //apiUrl = 'https://api-spotter.onrender.com';
  apiUrl = 'http://localhost:3000';

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
  ) {
    this.itensFiltrados = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  ngOnInit() {
    if (this.modalSearchItem || this.modalUpdateItem || this.modalDeleteItem) {
      let estoqueCache = localStorage.getItem('itensEstoque');
      this.itensEstoque = estoqueCache !== null ? JSON.parse(estoqueCache) : [];
    }
  }

  fecharModal(enviarLista: boolean) {
    this.fechar.emit(enviarLista);
  }

  fecharModalAddItem(addItem: boolean) {
    if (addItem) {
      if (this.newItemName === '' || this.newItemName === undefined) {
        this.toastr.show('Insira o nome do produto');
        return;
      }
      if (this.newItemAisle === undefined) {
        this.toastr.show('Insira o corredor do produto');
        return;
      }
      if (this.newItemPrice === '' || this.newItemPrice === undefined || this.newItemPrice === 'R$ 0,00') {
        this.toastr.show('Insira o preço do produto');
        return;
      }

      let valor = this.newItemPrice.replace(/[^\d,]/g, '');
      valor = valor.replace(/,/g, '').replace(/(\d{2})$/, '.$1');
      const valorCorreto = parseFloat(valor).toFixed(2);
      this.newItemPrice = `R$ ${valorCorreto.replace('.', ',')}`;

      this.newItemPrice = this.newItemPrice.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      let objNewItem = {
        'tipoReq': 'adicionar',
        'nome': this.newItemName,
        'corredor': this.newItemAisle,
        'price': parseFloat(this.newItemPrice)
      }
      this.fecharAddItem.emit(objNewItem);
    } else {
      this.fecharAddItem.emit(undefined);
    }
  }

  fecharModalSearchItem() {
    this.fecharSearchItem.emit();
  }

  fecharModalUpdateItem(updateItem: boolean) {
    if (updateItem) {

      let valor = this.updateItemPrice.replace(/[^\d,]/g, '');
      valor = valor.replace(/,/g, '').replace(/(\d{2})$/, '.$1');
      const valorCorreto = parseFloat(valor).toFixed(2);
      this.updateItemPrice = `R$ ${valorCorreto.replace('.', ',')}`;

      this.updateItemPrice = this.updateItemPrice.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      let objUpdateItem = {
        'tipoReq': 'atualizar',
        'id': this.updateItemID,
        'nome': this.updateItemName,
        'corredor': this.updateItemAisle,
        'price': parseFloat(this.updateItemPrice)
      }

      this.fecharUpdateItem.emit(objUpdateItem);
    } else {
      this.fecharUpdateItem.emit(undefined);
    }
  }

  fecharModalDeleteItem(deleteItem: boolean) {
    if (deleteItem) {
      this.isLoadingRequest = true;
      this.http.delete<any[]>(`${this.apiUrl}/api/deletaItem?id=${this.deleteItemID}`).subscribe({
        next: (response) => {
          this.isLoadingRequest = false;
        },
        error: (error) => {
          this.isLoadingRequest = false;
          console.error('Erro ao deletar item.', error);
        }
      });
      let objDeleteItem = {
        'tipoReq': 'deletar'
      }
      this.fecharDeleteItem.emit(objDeleteItem);
    } else {
      this.fecharDeleteItem.emit(undefined);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.itensEstoque
      .map((item: { nome: any; }) => item.nome)
      .filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  procurarItem() {
    if (this.formControl.value === null || this.formControl.value === '') {
      return;
    }
    const itemSelecionado = this.formControl.value.trim();
    this.isLoadingRequest = true;
    this.http.get<any[]>(`${this.apiUrl}/api/buscaDadosItem?nome=${itemSelecionado}`).subscribe({
      next: (response) => {
        this.isLoadingRequest = false;
        if (this.modalSearchItem) {
          this.searchItemName = response[0].nome;
          this.searchItemAisle = response[0].corredor;
          this.searchItemPrice = response[0].preco;
        }
        if (this.modalUpdateItem) {
          this.updateItemID = response[0].id;
          this.updateItemName = response[0].nome;
          this.updateItemAisle = response[0].corredor;
          this.updateItemPrice = response[0].preco;
        }
        if (this.modalDeleteItem) {
          this.deleteItemID = response[0].id;
          this.deleteItemName = response[0].nome;
          this.deleteItemAisle = response[0].corredor;
          this.deleteItemPrice = response[0].preco;
        }
      },
      error: (error) => {
        this.isLoadingRequest = false;
        console.error('Erro ao buscar itens do estoque.', error);
      }
    });
  }
}

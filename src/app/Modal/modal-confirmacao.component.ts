import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {
  @Output() fechar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fecharAddItem: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalMinhasListas!: boolean;
  @Input() modalAddItem!: boolean;
  @Input() modalListaDeCompras!: boolean;
  @Input() listaSelecionada: any;

  newItemName!: string;
  newItemAisle!: number;
  newItemPrice!: string;

  constructor(
    private toastr: ToastrService
  ) {}

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

      this.newItemPrice = this.newItemPrice.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
      let objNewItem = {
        'nome': this.newItemName,
        'corredor': this.newItemAisle,
        'price': parseFloat(this.newItemPrice)
      }
      this.fecharAddItem.emit(objNewItem);
    } else {
      this.fecharAddItem.emit(undefined);
    }
  }
}

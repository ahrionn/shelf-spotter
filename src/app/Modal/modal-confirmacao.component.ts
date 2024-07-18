import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {
  @Output() fechar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() modalMinhasListas!: boolean;
  @Input() modalListaDeCompras!: boolean;
  @Input() listaSelecionada: any;

  fecharModal(enviarLista: boolean) {
    this.fechar.emit(enviarLista);
  }
}

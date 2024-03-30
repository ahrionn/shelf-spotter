import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {
  @Output() fechar: EventEmitter<boolean> = new EventEmitter<boolean>();

  fecharModal(enviarLista: boolean) {
    this.fechar.emit(enviarLista);
  }
}

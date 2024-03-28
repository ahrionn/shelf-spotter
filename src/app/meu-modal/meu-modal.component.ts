import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-meu-modal',
  templateUrl: './meu-modal.component.html',
  styleUrls: ['./meu-modal.component.css']
})
export class MeuModalComponent {
  @Output() fechar: EventEmitter<boolean> = new EventEmitter<boolean>();

  fecharModal(enviarLista: boolean) {
    this.fechar.emit(enviarLista);
  }
}

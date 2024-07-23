import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minhas-listas',
  templateUrl: './minhas-listas.component.html',
  styleUrl: './minhas-listas.component.css'
})
export class MinhasListasComponent {

  minhasListas: string[] = [];
  minhasListasCopia: string[] = [];
  modalAberto: boolean = false;
  listaSelecionada: any;
  modalMinhasListas!: boolean;
  reversedList: string[] = [];

  constructor (
    private router: Router, 
  ) {}

  ngOnInit() {
    let storedListas = localStorage['minhasListas'];
    this.minhasListas = storedListas ? JSON.parse(storedListas) : [];
    this.minhasListasCopia = storedListas ? JSON.parse(storedListas) : [];
    for (let i = 0; i < this.minhasListas.length; i++) {
      this.minhasListas[i] = this.minhasListas[i][this.minhasListas[i].length - 1]
    }
    this.reversedList = [...this.minhasListas].reverse();
  }

  redirectToShopping(index: number) {
    let indexInverso: number;
    indexInverso = this.minhasListas.length - 1 - index;
    this.listaSelecionada = this.minhasListasCopia[indexInverso];
    if (!this.modalAberto) {
      this.abrirModal();
    }
  }
  

  abrirModal() {
    this.modalMinhasListas = true;
    this.modalAberto = true;
  }

  fecharModal(enviarLista: boolean) {
    this.modalMinhasListas = false;
    if (enviarLista) {
      this.modalAberto = false;
      this.router.navigateByUrl('/lista-de-compras', { state: { listaSelecionada: this.listaSelecionada } });
    } else {
      this.modalAberto = false;
    }
  }

  redirectToMain() {
    this.router.navigateByUrl('/pagina-inicial');
  }

}

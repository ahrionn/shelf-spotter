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
  }

  redirectToShopping(index: any) {
    
    let indexInverso;
    let ordemInversa;
    if (this.minhasListasCopia.length === 5) {
      ordemInversa = true;
      switch (index) {
        case 0: 
          indexInverso = 4;
          break;
        case 1: 
          indexInverso = 3;
          break
        case 3: 
          indexInverso = 1;
          break
        case 4: 
          indexInverso = 0;
          break
        default:
          indexInverso = 2;
      }
      this.listaSelecionada = this.minhasListasCopia[indexInverso];
    } else {
      ordemInversa = false;
      this.listaSelecionada = this.minhasListasCopia[index];
    }

    if (!this.modalAberto) {
      this.abrirModal();
      return;
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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingInicialService {

  private itensEstoqueSource = new BehaviorSubject<any[]>([]);
  itensEstoque$ = this.itensEstoqueSource.asObservable();

  atualizarItensEstoque(itens: any[]) {
    this.itensEstoqueSource.next(itens);
  }

  constructor() { }
}

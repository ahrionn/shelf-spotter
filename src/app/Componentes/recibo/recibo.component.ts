import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {
  itensAEnviar: { nome: string, corredor: number }[] = [];
  itensAgrupados: { corredor: number; itens: { nome: string; corredor: number; }[]; }[] = [];

  constructor() {}

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.itensAEnviar) {
      this.itensAEnviar = navigation.itensAEnviar;
      this.itensAgrupados = this.agruparItensPorCorredor();
    }
  }

  agruparItensPorCorredor(): { corredor: number, itens: { nome: string, corredor: number }[] }[] {
    const grupos: { corredor: number, itens: { nome: string, corredor: number }[] }[] = [];

    this.itensAEnviar.forEach(item => {
      const grupoExistente = grupos.find(grupo => grupo.corredor === item.corredor);
      if (grupoExistente) {
        grupoExistente.itens.push(item);
      } else {
        grupos.push({ corredor: item.corredor, itens: [item] });
      }
    });

    grupos.sort((a, b) => a.corredor - b.corredor);

    return grupos;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {
  itensAEnviar: any;
  itensAgrupados: any = [];
  precoTotalLista: number = 0;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.itensAEnviar) {
      this.itensAEnviar = navigation.itensAEnviar;
      this.itensAgrupados = this.agruparItensPorCorredor();
      for (let i = 0; i < this.itensAEnviar.length; i++) {
        this.precoTotalLista += parseFloat(this.itensAEnviar[i].preco) * this.itensAEnviar[i].qtd;
      }
      this.precoTotalLista = parseFloat(this.precoTotalLista.toFixed(2));
    }
  }

  agruparItensPorCorredor(): any {
    const grupos: any = [];

    this.itensAEnviar.forEach((item: { corredor: any; }) => {
      const grupoExistente = grupos.find((grupo: { corredor: any; }) => grupo.corredor === item.corredor);
      if (grupoExistente) {
        grupoExistente.itens.push(item);
      } else {
        grupos.push({ corredor: item.corredor, itens: [item] });
      }
    });

    grupos.sort((a: any, b: any) => a.corredor - b.corredor);

    return grupos;
  }

  voltarParaLista() {
    this.router.navigateByUrl('/lista-de-compras');
  }
}

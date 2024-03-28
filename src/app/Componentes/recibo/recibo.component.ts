import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {
  itensAdicionais: string[][] = [[]];

  constructor() {}

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.itensAdicionais) {
      this.itensAdicionais = navigation.itensAdicionais;
    }
  }
}

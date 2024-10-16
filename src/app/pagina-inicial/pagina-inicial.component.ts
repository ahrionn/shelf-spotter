import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css'
})
export class PaginaInicialComponent {

  constructor(
    private router: Router, 
  ) { }

  redirect(rota: string) {
    this.router.navigateByUrl(`/${rota}`);
  }

  redirectToConfigs() {
    this.router.navigateByUrl('/configs');
  }
}

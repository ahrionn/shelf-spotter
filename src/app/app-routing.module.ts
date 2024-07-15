import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaDeComprasComponent } from './Componentes/lista-de-compras/lista-de-compras.component';
import { ReciboComponent } from './Componentes/recibo/recibo.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';

const routes: Routes = [
  { path: '', redirectTo: '/pagina-inicial', pathMatch: 'full' }, 
  { path: 'pagina-inicial', component: PaginaInicialComponent }, 
  { path: 'lista-de-compras', component: ListaDeComprasComponent }, 
  { path: 'recibo', component: ReciboComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

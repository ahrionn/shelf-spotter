import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaDeComprasComponent } from './Componentes/lista-de-compras/lista-de-compras.component';
import { ReciboComponent } from './Componentes/recibo/recibo.component';

const routes: Routes = [
  { path: '', redirectTo: '/lista-de-compras', pathMatch: 'full' }, 
  { path: 'lista-de-compras', component: ListaDeComprasComponent }, 
  { path: 'recibo', component: ReciboComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

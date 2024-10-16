import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaDeComprasComponent } from './Componentes/lista-de-compras/lista-de-compras.component';
import { ReciboComponent } from './Componentes/recibo/recibo.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';
import { MinhasListasComponent } from './Componentes/minhas-listas/minhas-listas.component';
import { ConfigsComponent } from './Componentes/configs/configs.component';

const routes: Routes = [
  { path: '', redirectTo: '/pagina-inicial', pathMatch: 'full' }, 
  { path: 'pagina-inicial', component: PaginaInicialComponent }, 
  { path: 'minhas-listas', component: MinhasListasComponent }, 
  { path: 'lista-de-compras', component: ListaDeComprasComponent }, 
  { path: 'recibo', component: ReciboComponent },
  { path: 'configs', component: ConfigsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

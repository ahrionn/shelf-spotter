import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ListaDeComprasComponent } from './Componentes/lista-de-compras/lista-de-compras.component';
import { ReciboComponent } from './Componentes/recibo/recibo.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalConfirmacaoComponent } from './Modal/modal-confirmacao.component';
import { HeaderComponent } from './Componentes/header/header.component';
import { FooterComponent } from './Componentes/footer/footer.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';
import { MinhasListasComponent } from './Componentes/minhas-listas/minhas-listas.component';
import { ConfigsComponent } from './Componentes/configs/configs.component';
import { CurrencyMaskDirective } from './Diretivas/currencyMask/currency-mask.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaDeComprasComponent,
    ReciboComponent,
    ModalConfirmacaoComponent,
    HeaderComponent,
    FooterComponent,
    PaginaInicialComponent,
    MinhasListasComponent,
    ConfigsComponent,
    CurrencyMaskDirective,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      toastClass: 'toast-message',
      timeOut: 3000,
      positionClass: 'toast-center',
      preventDuplicates: true,
      closeButton: false,
      progressBar: false,
      enableHtml: false,
      newestOnTop: true,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

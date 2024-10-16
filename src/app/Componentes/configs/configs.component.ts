import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.css'
})
export class ConfigsComponent {

  modalAddItem!: boolean;
  modalAberto: boolean = false;
  isLoadingRequest: boolean = false;
  apiUrl = 'https://api-spotter.onrender.com';
  //apiUrl = 'http://localhost:3000';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  redirectToMain() {
    this.router.navigateByUrl('/pagina-inicial');
  }

  onAddItem() {
    this.modalAddItem = true;
    this.modalAberto = true;
  }

  onSearchItem() {

  }

  onUpdateItem() {

  }

  onDeleteItem() {

  }

  fecharModal(objNewItem: any) {
    this.modalAddItem = false;
    if (objNewItem !== undefined) {
      this.modalAberto = false;
      this.isLoadingRequest = true;
      this.http.post<any>(`${this.apiUrl}/api/addItem`, objNewItem).subscribe({
        next: (response) => {
          this.isLoadingRequest = false;
          this.toastr.show('Item adicionado com sucesso!');
          console.log('Item adicionado com sucesso.', response);
        },
        error: (error) => {
          this.isLoadingRequest = false;
          console.error('Erro ao adicionar item.', error);
        }
      });
    } else {
      this.modalAberto = false;
    }
  }

}

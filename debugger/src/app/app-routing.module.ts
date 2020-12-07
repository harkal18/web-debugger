import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientsComponent } from './clients/clients.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent
  },
  {
    path: '**',
    component: ClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

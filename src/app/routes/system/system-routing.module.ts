import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {UserComponent} from "./user/user.component";


const routes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }

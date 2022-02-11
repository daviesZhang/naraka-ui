import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import {SystemRoutingModule} from "./system-routing.module";
import {NgxGridTableModule} from "ngx-grid-table";


@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgxGridTableModule
  ]
})
export class SystemModule { }

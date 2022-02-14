import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import {SystemRoutingModule} from "./system-routing.module";
import {NgxGridTableModule} from "ngx-grid-table";
import { UserComponent } from './user/user.component';

import {JsonFormModule} from "@shared/json-form/json-form.module";
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    MenuComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgxGridTableModule,
    JsonFormModule,
    SharedModule
  ]
})
export class SystemModule { }

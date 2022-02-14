import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu/menu.component';
import {SystemRoutingModule} from "./system-routing.module";
import {UserComponent} from './user/user.component';

import {JsonFormModule} from "@shared/json-form/json-form.module";
import {GridTableModule} from "@shared/grid-table.module";


@NgModule({
  declarations: [
    MenuComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    GridTableModule,
    JsonFormModule
  ]
})
export class SystemModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu/menu.component';
import {SystemRoutingModule} from "./system-routing.module";
import {UserComponent} from './user/user.component';

import {JsonFormModule} from "@shared/json-form/json-form.module";
import {GridTableModule} from "@shared/grid-table.module";
import {CommonModalModule} from "@shared/common-modal/common-modal.module";
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    MenuComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemRoutingModule,
    GridTableModule,
    JsonFormModule,

    CommonModalModule,
  ]
})
export class SystemModule { }

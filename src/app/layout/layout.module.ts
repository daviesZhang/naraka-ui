import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { PassportComponent } from './passport/passport.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    DefaultComponent,
    PassportComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }

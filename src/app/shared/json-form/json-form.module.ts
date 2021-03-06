import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonFormComponent } from './json-form.component';
import {FormlyModule} from "@ngx-formly/core";
import {NgxFormlyAntdModule} from "ngx-formly-antd";
import {SharedModule} from "@shared/shared.module";



@NgModule({
  declarations: [
    JsonFormComponent
  ],
  imports: [
    CommonModule,
    FormlyModule,
    NgxFormlyAntdModule,
    SharedModule,
  ],
  exports:[
    JsonFormComponent,
    FormlyModule
  ]
})
export class JsonFormModule { }

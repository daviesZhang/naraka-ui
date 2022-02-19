import {NgModule, Provider} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxGridTableModule, NgxGridTableTranslateService} from "ngx-grid-table";
import {SharedModule} from "@shared/shared.module";
import {GridTranslateService} from "@core/services/grid-translate.service";



/**
 * 手动注入一个表格的翻译服务,替代默认的,因为项目已经用了国际化模块,整合到一起
 * 如果项目未使用国际化
 * 使用默认的翻译服务需要在第一次使用GridTable前调用NgxGridTableTranslateService#setI18nText,传入翻译文本对象
 *
 */
const GRIDI18NSERVICE_PROVIDES: Provider[] = [
  {
    provide: NgxGridTableTranslateService,
    useClass:GridTranslateService
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    NgxGridTableModule,
  ],providers:[
    ...GRIDI18NSERVICE_PROVIDES
  ],
  exports:[
    NgxGridTableModule
  ]
})
export class GridTableModule { }

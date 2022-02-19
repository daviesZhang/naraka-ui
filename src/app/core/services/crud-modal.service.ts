import {Injectable, TemplateRef} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {CommonModalComponent} from "@shared/common-modal/common-modal/common-modal.component";
import {filter, firstValueFrom, Observable} from "rxjs";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {ModalOptions} from "ng-zorro-antd/modal/modal-types";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class CrudModalService {

  constructor(private modal:NzModalService,private translate:TranslateService) { }


  /**
   * 当modal被关闭时,返回值Observable会发出唯一值,结果为true则表示顺利执行后关闭,false表示手动销毁,没有执行请求
   * @param title modal标题
   * @param content modal内容
   * @param request 请求方法
   * @param data 默认数据
   */
  createCommonModal(title:string, content: FormlyFieldConfig[]|string|TemplateRef<NzSafeAny>, request: (data: any) => Observable<any>,data?:any):Observable<any>{

   return this.modal.create({
      nzTitle: title,
      nzContent: CommonModalComponent,
      nzComponentParams: {
        content,
        request,
        data
      },
      nzFooter: null,
    }).afterClose.asObservable();
  }


  /**
   * 当modal被关闭时,返回值Observable会发出唯一值,结果为true则表示顺利执行后关闭,false表示手动销毁,没有执行请求
   * @param title modal标题
   * @param content modal内容
   * @param request 请求方法
   * @param data 默认数据
   */
  createConfirmModal(title:string,
                     content: FormlyFieldConfig[]|string|TemplateRef<NzSafeAny>,
                     request: (data: any) => Observable<any>,data?:any):Observable<any>{
    const options:ModalOptions= {
      nzTitle: title,
      nzContent: CommonModalComponent,
      nzComponentParams: {
        content,
        data,
        request,
        showFooter: false
      },
      nzOnOk: () => firstValueFrom(request(null)),

    };

    return this.modal.confirm(options).afterClose.asObservable();
  }





  /**
   * 简单删除确认框,当删除成功后Observable才会发出值
   * @param request
   */
  simpleDeleteConfirmModal(request: (data: any) => Observable<any>):Observable<any>{
    const options:ModalOptions= {
      nzTitle:  this.translate.instant('common.delete'),
      nzContent: CommonModalComponent,
      nzComponentParams: {
        content: this.translate.instant('common.deleteConfirm'),
        request,
        showFooter: false
      },
      nzOnOk: () => firstValueFrom(request(null)),
    };
    return this.modal.confirm(options).afterClose.asObservable().pipe(filter(next=>!!next));
  }
}

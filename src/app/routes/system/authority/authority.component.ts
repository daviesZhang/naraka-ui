import {Component, Input, OnInit} from '@angular/core';
import {AbstractGridTablePage} from "../../abstract-grid-table-page";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {CrudHelperService} from "@core/services/crud-helper.service";
import {GridTablePagination, RequestDataType, RowButton} from 'ngx-grid-table';
import {QueryPage} from '@core/modal/query';
import {Observable} from 'rxjs';
import {Page, PageItem} from '@core/modal/page';

import {FormlyFieldConfig} from "@ngx-formly/core";
import {ColDef, GridOptions, SideBarDef} from "ag-grid-community";

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss']
})
export class AuthorityComponent extends AbstractGridTablePage implements OnInit {

  searchFields: FormlyFieldConfig[] = [];
  @Input()
  rowButton?: RowButton|null;
  /**
   * 角色code
   */
  @Input()
  roleCode: string | null = null;



  @Input()
  sideBar?: SideBarDef | string | boolean | null = undefined;


  @Input()
  gridTablePagination?: GridTablePagination;

  @Input()
  columnDefs: ColDef[] = [
    {headerName: this.translate.instant('page.system.authority.resource.label'), field: 'resource'},
    {headerName: this.translate.instant('page.system.authority.resourceType.label'), field: 'resourceType'},
    {headerName: this.translate.instant('page.system.authority.processor.label'), field: 'processor'},
    {headerName: this.translate.instant('page.system.authority.processorValue.label'), field: 'processorValue'},
    {headerName: this.translate.instant('common.remark'), field: 'remark'},
    {headerName: this.translate.instant('common.createdBy'), field: 'createdBy'},
    {headerName: this.translate.instant('common.createdTime'), field: 'createdTime', sortable: true},
    {headerName: this.translate.instant('common.updatedBy'), field: 'updatedBy'},
    {headerName: this.translate.instant('common.updatedTime'), field: 'updatedTime'}
  ];
  gridOptions: GridOptions = {};

  constructor(private http: HttpClient, private translate: TranslateService,
              private helper: CrudHelperService) {
    super();
  }


  ngOnInit(): void {

    this.gridOptions = {
      columnDefs: this.columnDefs,
      sideBar: this.sideBar,
    }
  }

  request = (params: RequestDataType<QueryPage>): Observable<Page<PageItem>> => {
    if (this.roleCode) {
      params.query['roleCode'] = {filter:this.roleCode,type:'NOT_EQUALS'};
    }
    return this.http.post<Page<PageItem>>("/admin/system/authority/list", params);
  };


  create() {

    const fields: FormlyFieldConfig[] = [
      {}
    ]
    this.helper.createCommonModal(this.translate.instant('common.create'), fields,
      params => this.http.post('/admin/system/authority', params));
  }

  delete(data:PageItem){

  }



}

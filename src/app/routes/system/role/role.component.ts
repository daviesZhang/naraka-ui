import {Component, OnInit} from '@angular/core';

import {QueryPage} from '@core/modal/query';
import {Page, RequestDataType, SimpleGridTablePagination} from 'ngx-grid-table';
import {map, Observable} from 'rxjs';
import {AbstractGridTablePage} from "../../abstract-grid-table-page";
import {HttpClient} from "@angular/common/http";
import {PageItem} from "@core/modal/page";
import {GridOptions} from "ag-grid-community";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import {ValidationService} from "@core/services/validation.service";
import {AbstractControl} from "@angular/forms";
import {CrudHelperService} from "@core/services/crud-helper.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthorityComponent} from "../authority/authority.component";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {RoleAuthorityComponent} from "./role-authority/role-authority.component";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent extends AbstractGridTablePage implements OnInit {

  request = (params: RequestDataType<QueryPage>): Observable<Page<PageItem>> => this.http.post<Page<PageItem>>("/admin/system/role/list", params);


  showAuthorityApi = "/admin/system/role/authority";

  constructor(private http: HttpClient,
              private helperService: CrudHelperService,
              private modal: NzModalService,
              private drawerService:NzDrawerService,
              private validationService: ValidationService, private translate: TranslateService) {
    super();
  }

  searchFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid-search-panel',
      fieldGroup: [
        {
          key: 'createdTime',
          type: 'date-range',
          templateOptions: {
            labelWidth: 80,
            ranges: this.helperService.queryDateRanges(() => this.searchForm?.value['createdTime'])
          },
          expressionProperties: {
            'templateOptions.label': this.translate.stream('common.createdTime'),
            'templateOptions.placeholder': this.translate.stream('common.createdTime'),
          },
        },
        {
          key: 'name',
          type: 'input',
          templateOptions: {

            labelWidth: 80,
          },
          expressionProperties: {
            'templateOptions.label': this.translate.stream('page.system.role.code.label'),
            'templateOptions.placeholder': this.translate.stream('page.system.role.code.placeholder'),
          },
        },
        {
          key: 'code',
          type: 'input',
          templateOptions: {

            labelWidth: 80,
          },
          expressionProperties: {
            'templateOptions.label': this.translate.stream('page.system.role.code.label'),
            'templateOptions.placeholder': this.translate.stream('page.system.role.code.placeholder'),
          },
        },
      ]
    }
  ];

  gridOptions: GridOptions = {

    columnDefs: [
      {headerName: this.translate.instant('page.system.role.code.label'), field: 'code',
       cellRenderer: 'agGroupCellRenderer'},
      {headerName: this.translate.instant('page.system.role.name.label'), field: 'name'},
      {headerName: this.translate.instant('common.remark'), field: 'remark'},
      {headerName: this.translate.instant('common.createdBy'), field: 'createdBy'},
      {headerName: this.translate.instant('common.createdTime'), field: 'createdTime', sortable: true},
      {headerName: this.translate.instant('common.updatedBy'), field: 'updatedBy'},
      {headerName: this.translate.instant('common.updatedTime'), field: 'updatedTime'}
    ]
  };

  ngOnInit(): void {
  }

  create() {
    const fields: FormlyFieldConfig[] = [
      {
        key: 'code',
        type: 'input',

        templateOptions: {
          required: true,
          labelWidth: 80,
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.role.code.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.role.code.placeholder'),
        },
        validation: {
          messages: {
            required: this.validationService.requiredMessage
          }
        },
        validators: {
          code: {
            expression: (c: AbstractControl, field: FormlyFieldConfig) => !c.value || /^[A-Z_]{2,16}$/.test(c.value),
            message: (error: any, field: FormlyFieldConfig) => this.translate.get("common.validation.username"),
          }
        },
      },
      {
        key: 'name',
        type: 'input',

        templateOptions: {
          required: true,
          maxLength: 12,
          labelWidth: 80,
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.role.name.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.role.name.placeholder'),
        },
        validation: {
          messages: {
            required: this.validationService.requiredMessage,
            maxLength: this.validationService.maxLengthMessage
          }
        }
      },
      {
        key: 'remark',
        type: 'input',
        templateOptions: {
          labelWidth: 80,
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('common.remark'),
          'templateOptions.placeholder': this.translate.stream('common.remark'),
        }
      }
    ];
    this.helperService.createCommonModal(this.translate.instant('common.create'), fields,
      (data) => this.http.post('/admin/system/role', data).pipe(map(() => true)))
      .subscribe(next => next && this.gridTable?.searchRowsData());
  }


  showAuthority(code: string) {
    return this.drawerService.create({
      nzTitle: '权限列表',
      nzContent: RoleAuthorityComponent,
      nzHeight:500,
      nzPlacement:"bottom",
      nzContentParams: {
        code,
        showAuthorityApi:this.showAuthorityApi
      },

    })
  }


  assignAuthority(code:string){

  }
}

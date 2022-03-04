import {Component, OnInit} from '@angular/core';
import {GridOptions} from "ag-grid-community";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {AbstractGridTablePage} from "../../abstract-grid-table-page";
import {NzModalService} from "ng-zorro-antd/modal";
import {HttpClient} from "@angular/common/http";
import {ValidationService} from "@core/services/validation.service";
import {CrudHelperService} from "@core/services/crud-helper.service";
import {TranslateService} from "@ngx-translate/core";
import {Page, PageItem} from "@core/modal/page";
import {ParamsTransform, QueryPage} from "@core/modal/query";
import {map} from "rxjs";
import {dateToString} from "@shared/utils/tools";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends AbstractGridTablePage implements OnInit {

  gridOptions!: GridOptions;

  override transform: ParamsTransform = {
    username: (value) => ({type: "EQUALS", filter: value}),
    status: (value) => ({type: "CONTAINS", filter: value}),
    createdTime: (value: Array<Date>) => [{
      type: "GREATERTHANEQUAL",
      filter: dateToString(value[0])
    }, {type: "LESSTHANEQUAL", filter: dateToString(value[1])}]
  };
  request = (params: QueryPage) => this.http.post<Page<PageItem>>("/admin/system/user/list", params);

  override getData = (params: QueryPage) => this.getDataUtils<PageItem>(params, this.request, {createdTime: []});

  searchFields: FormlyFieldConfig[] = [{
    fieldGroupClassName: 'grid-search-panel',
    fieldGroup: [
      {
        key: 'createdTime',
        type: 'date-range',
        templateOptions: {
          labelWidth: 80,
          ranges: this.crud.queryDateRanges(() => this.searchForm?.value['createdTime'])
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('common.createdTime'),
          'templateOptions.placeholder': this.translate.stream('common.createdTime'),
        },
      },
      {
        key: 'username',
        type: 'input',
        templateOptions: {

          labelWidth: 80,
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.user.username.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.user.username.placeholder'),
        },
      },
      {
        key: 'status',
        type: 'select',
        templateOptions: {
          labelWidth: 80,
          allowClear: true,
          selectWidth: 150,

          options: [
            {label: this.translate.instant('common.enable'), value: 0},
            {label: this.translate.instant('common.disable'), value: 1}
          ]
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.user.status.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.user.status.placeholder'),
        },
      }
    ]
  }];


  constructor(private modal: NzModalService,
              private http: HttpClient,
              private validationMessageService: ValidationService,
              private crud: CrudHelperService,
              private translate: TranslateService) {
    super();
  }

  ngOnInit(): void {

    this.gridOptions = {
      getRowNodeId: data => data.username,
      columnDefs: [
        {headerName: this.translate.instant('page.system.user.username.label'), field: 'username'},
        {headerName: this.translate.instant('page.system.user.email.label'), field: 'email'},
        {headerName: this.translate.instant('page.system.user.phone.label'), field: 'phone'},
        {headerName: this.translate.instant('page.system.user.passwordExpireTime.label'), field: 'passwordExpireTime'},
        {headerName: this.translate.instant('page.system.user.role.label'), field: 'role'},
        {headerName: this.translate.instant('page.system.user.roleCode.label'), field: 'roleCode'},
        {headerName: this.translate.instant('page.system.user.type.label'), field: 'type'},
        {headerName: this.translate.instant('page.system.user.status.label'), field: 'status'},
        {headerName: this.translate.instant('common.remark'), field: 'remark'},
        {headerName: this.translate.instant('common.createdBy'), field: 'createdBy'},
        {headerName: this.translate.instant('common.createdTime'), field: 'createdTime', sortable: true},
        {headerName: this.translate.instant('common.updatedBy'), field: 'updatedBy'},
        {headerName: this.translate.instant('common.updatedTime'), field: 'updatedTime'}
      ]
    }
  }

  create() {
    const fields: FormlyFieldConfig[] = [{
      key: 'username',
      type: 'input',
      templateOptions: {
        required: true,
        labelWidth: 80,
      },
      validation: {
        messages: {
          required: this.validationMessageService.requiredMessage
        }
      },
      validators: {
        username: this.validationMessageService.username()
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('page.system.user.username.label'),
        'templateOptions.placeholder': this.translate.stream('page.system.user.username.placeholder'),
      },
    },
      {
        key: 'password',
        type: 'input',
        templateOptions: {
          labelWidth: 80,

        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.user.password.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.user.password.placeholder'),
        },
        validation: {
          messages: {
            required: this.validationMessageService.requiredMessage
          }
        },
        validators: {
          password: this.validationMessageService.password()
        }
      },
      {
        key: 'phone',
        type: 'input',
        templateOptions: {
          labelWidth: 80,
        },
        validation: {
          messages: {
            required: this.validationMessageService.requiredMessage
          }
        },
        validators: {
          phone: this.validationMessageService.phone()
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.user.phone.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.user.phone.placeholder'),
        },
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          labelWidth: 80
        },
        validation: {
          messages: {
            required: this.validationMessageService.requiredMessage
          }
        },
        validators: {
          email: this.validationMessageService.email()
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.user.email.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.user.email.placeholder'),
        }
      }]

    this.crud.createCommonModal(this.translate.instant('page.system.user.create'), fields, (data) =>
      this.http.post<Page<PageItem>>("/admin/system/user", data).pipe(map(() => true)))
      .subscribe((next) => {
        next && this.gridTable?.searchRowsData();
      });

  }
}

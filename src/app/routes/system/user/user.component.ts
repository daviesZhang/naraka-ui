import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColDef, GridOptions, RowNode} from "ag-grid-community";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {AbstractGridTablePage} from "../../abstract-grid-table-page";
import {NzModalService} from "ng-zorro-antd/modal";
import {HttpClient} from "@angular/common/http";
import {ValidationService} from "@core/services/validation.service";
import {CrudHelperService} from "@core/services/crud-helper.service";
import {TranslateService} from "@ngx-translate/core";
import {Page, PageItem} from "@core/modal/page";
import {ParamsTransform, QueryPage} from "@core/modal/query";
import {delay, map} from "rxjs";
import {dateToString} from "@shared/utils/tools";
import {MeService} from "@core/services/me.service";
import {TemplateRendererComponent} from "ngx-grid-table";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends AbstractGridTablePage implements OnInit {


  createUserApi = "/admin/system/user";

  gridOptions!: GridOptions;

  override transform: ParamsTransform = {
    status: (value) => ({type: "CONTAINS", filter: value}),
    createdTime: (value: Array<Date>) => [{
      type: "GREATERTHANEQUAL",
      filter: dateToString(value[0])
    }, {type: "LESSTHANEQUAL", filter: dateToString(value[1])}]
  };

  gridRequestUrl = "/admin/system/user/list";

  request = (params: QueryPage) => this.http.post<Page<PageItem>>(this.gridRequestUrl, params);

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


  assignRoleApi = "/admin/system/user/assign";
  getPhoneApi = "/admin/system/user/phone";
  putPhoneApi = "/admin/system/user/phone";
  getEmailApi = "/admin/system/user/email";
  putEmailApi = "/admin/system/user/email";
  @ViewChild("phoneTemplate", {static: true})
  phoneTemplate!: TemplateRef<any>;

  @ViewChild("emailTemplate", {static: true})
  emailTemplate!: TemplateRef<any>;
  @ViewChild("roleTemplate", {static: true})
  roleTemplate!: TemplateRef<any>;

  constructor(private modal: NzModalService,
              private http: HttpClient,
              private meService: MeService,
              private validationMessageService: ValidationService,
              private crud: CrudHelperService,
              private translate: TranslateService) {
    super();

  }

  ngOnInit(): void {
    const columnDefs: ColDef[] = [
      {headerName: this.translate.instant('page.system.user.username.label'), field: 'username'},
      {
        headerName: this.translate.instant('page.system.user.email.label'), field: 'email',
        valueGetter: params => {
          if (params.data.email.indexOf("**") < 0) {
            params.data.fullEmail = true;
          }
          return params.data.email;
        },
        cellRenderer: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.emailTemplate
        }
      },
      {
        headerName: this.translate.instant('page.system.user.phone.label'), field: 'phone', width: 140,
        cellRenderer: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.phoneTemplate
        }, valueGetter: params => {
          if (params.data.phone.indexOf("**") < 0) {
            params.data.fullPhone = true;
          }
          return params.data.phone;
        },
      },
      {headerName: this.translate.instant('page.system.user.passwordExpireTime.label'), field: 'passwordExpireTime'},
      {
        headerName: this.translate.instant('page.system.user.role.label'), field: 'role',
        cellRenderer: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.roleTemplate
        }
      },

      {headerName: this.translate.instant('page.system.user.type.label'), field: 'type'},
      {headerName: this.translate.instant('page.system.user.status.label'), field: 'status'},
      {headerName: this.translate.instant('common.remark'), field: 'remark'},
      {headerName: this.translate.instant('common.createdBy'), field: 'createdBy'},
      {headerName: this.translate.instant('common.createdTime'), field: 'createdTime', sortable: true},
      {headerName: this.translate.instant('common.updatedBy'), field: 'updatedBy'},
      {headerName: this.translate.instant('common.updatedTime'), field: 'updatedTime'}
    ]
    this.gridOptions = {
      getRowNodeId: data => data.username,
      columnDefs: this.meService.filterColumnByPost(columnDefs, this.gridRequestUrl),
    }
  }


  seePhone(node: RowNode) {
    const username = node.data.username;
    const phone = node.data.phone;
    node.data.fullPhone = 'loading';
    this.http.get(this.getPhoneApi, {params: {username}}).subscribe({
      next: next => {
        node.data.fullPhone = true;
        node.setDataValue("phone", next);
      }, error: error => {
        node.data.fullPhone = false;
        node.setDataValue("phone", phone);
      }
    });
  }

  updatePhone(node: RowNode) {
    const username = node.data.username;
    const phone = node.data.phone;
    const fields: FormlyFieldConfig[] = [
      {
        key: 'phone',
        type: 'input',
        defaultValue: /\*/.test(phone) ? '' : phone,
        templateOptions: {
          labelWidth: 80,
          required: true,
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
        }
      }
    ];
    this.crud.createCommonModal(this.translate.instant('page.system.user.updatePhone'), fields, (data) =>
      this.http.put<string>(this.putPhoneApi, Object.assign({username}, data)).pipe(map(() => data)))
      .subscribe((next) => {
        next && node.setDataValue("phone", next.phone);
      });
  }

  seeEmail(node: RowNode) {
    const username = node.data.username;
    const phone = node.data.email;
    node.data.fullEmail = 'loading';
    this.http.get(this.getEmailApi, {params: {username}}).subscribe({
      next: next => {
        node.data.fullEmail = true;
        node.setDataValue("email", next);
      },
      error: error => {
        node.data.fullEmail = false;
        node.setDataValue("email", phone);
      }
    });
  }

  updateEmail(node: RowNode) {
    const username = node.data.username;
    const email = node.data.email;
    const fields: FormlyFieldConfig[] = [
      {
        key: 'email',
        type: 'input',
        defaultValue: /\*/.test(email) ? '' : email,
        templateOptions: {
          labelWidth: 80,
          required: true,
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
      }
    ];
    this.crud.createCommonModal(this.translate.instant('page.system.user.updateEmail'), fields, (data) =>
      this.http.put<string>(this.putEmailApi, Object.assign({username}, data)).pipe(map(() => data)))
      .subscribe((next) => {
        next && node.setDataValue("email", next.email);
      });
  }

  assignRole(node: PageItem) {
    const username = node['username'];
    const role = node['roleCode'];
    const serverSearch = (name: string) => this.http.post<Page<PageItem>>("/admin/system/role/list",
      new QueryPage(1, 500, name ? {name: {type: 'LIKE', filter: name}} : {}))
      .pipe(map(page => page.items || []), map(items => items.map(item => ({
        label: item['name'],
        value: item['code']
      }))));
    const fields: FormlyFieldConfig[] = [
      {
        key: 'code',
        type: 'select',
        defaultValue: role,
        templateOptions: {
          labelWidth: 80,
          selectWidth: 250,
          required: true,
          showSearch: true,
          serverSearch
        },
        validation: {
          messages: {
            required: this.validationMessageService.requiredMessage
          }
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.user.role.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.user.role.placeholder'),
        }
      }
    ];

    this.crud.createCommonModal(this.translate.instant('page.system.user.assign'), fields, (data) =>
      this.http.post<Page<PageItem>>(this.assignRoleApi, Object.assign({username}, data)).pipe(map(() => true)))
      .subscribe((next) => {
        next && this.gridTable?.searchRowsData();
      });

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
      this.http.post<Page<PageItem>>(this.createUserApi, data).pipe(map(() => true)))
      .subscribe((next) => {
        next && this.gridTable?.searchRowsData();
      });

  }
}

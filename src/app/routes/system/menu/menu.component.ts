import {Component, OnInit} from '@angular/core';

import {map} from "rxjs";
import {RequestData} from "ngx-grid-table";
import {HttpClient} from "@angular/common/http";
import {changeDataToGridTree} from "@shared/utils/tools";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {GridOptions} from "ag-grid-community";
import {TranslateService} from "@ngx-translate/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {CrudModalService} from "@core/services/crud-modal.service";
import {ValidationService} from "@core/services/validation.service";
import {AbstractGridTablePage} from "../../abstract-grid-table-page";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AbstractGridTablePage implements OnInit {

  gridOptions!: GridOptions;

  getData!: RequestData<{ [key: string]: any }>;


  searchFields: FormlyFieldConfig[] = [{
    fieldGroupClassName: 'grid-search-panel',
    fieldGroup: [
      {
        key: 'code',
        type: 'input',
        templateOptions: {
          label: 'Code',
          labelWidth: '80px',
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.menu.code.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.menu.code.placeholder'),
        },
      },
      {
        key: 'url',
        type: 'input',
        templateOptions: {
          labelWidth: '80px',
        },
        expressionProperties: {
          'templateOptions.label': this.translate.stream('page.system.menu.url.label'),
          'templateOptions.placeholder': this.translate.stream('page.system.menu.url.placeholder'),
        },
      }
    ]
  }];


  fields: FormlyFieldConfig[] = [
    {
      key: 'code',
      type: 'input',
      templateOptions: {
        label: 'Code',
        labelWidth: '80px',
        required: true
      },
      validation: {
        messages: {
          required: this.validationMessageService.requiredMessage
        }
      },
      validators: {
        // username:this.validationMessageService.username()
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('page.system.menu.code.label'),
        'templateOptions.placeholder': this.translate.stream('page.system.menu.code.placeholder'),
      }
    },
    {
      key: 'url',
      type: 'input',
      templateOptions: {
        labelWidth: '80px',
        required: true,
      },
      validation: {
        messages: {
          required: this.validationMessageService.requiredMessage,
        }
      },

      expressionProperties: {
        'templateOptions.label': this.translate.stream('page.system.menu.url.label'),
        'templateOptions.placeholder': this.translate.stream('page.system.menu.url.placeholder'),
      },
    },
    {
      key: 'remark',
      type: 'input',
      templateOptions: {
        labelWidth: '80px',
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('page.system.menu.remark.label'),
        'templateOptions.placeholder': this.translate.stream('page.system.menu.remark.placeholder'),
      },
    }
  ];



  constructor(
    private modal: NzModalService,
    private http: HttpClient,
    private validationMessageService: ValidationService,
    private crud: CrudModalService,
    private translate: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.getData = (params) => {

      return this.http.post<Array<any>>("/system/menu/list", null)
        .pipe(map(next => {
          return {
            items: changeDataToGridTree(next, {parent: item => item.parent, id: item => item.id}),
            total: next.length
          }
        }));
    };
    this.gridOptions = {
      treeData: true,
      getDataPath: data => data.path,
      groupDisplayType: 'custom',
      columnDefs: [
        {
          headerName: this.translate.instant('page.system.menu.url.label'),
          field: 'url',
          cellRenderer: 'agGroupCellRenderer',
          showRowGroup: true
        },
        {headerName:this.translate.instant('page.system.menu.code.label'), field: 'code'},
        {headerName: this.translate.instant('page.system.menu.remark.label'), field: 'remark'},
        {headerName: this.translate.instant('common.createdBy'), field: 'createdBy'},
        {headerName: this.translate.instant('common.createdTime'), field: 'createdTime'},
        {headerName: this.translate.instant('common.updatedBy'), field: 'updatedBy'},
        {headerName: this.translate.instant('common.updatedTime'), field: 'updatedTime'}
      ]
    }
  }


  search() {
    if (this.gridTable) {
      this.gridTable.searchRowsData(this.jsonForm?.value);
    }
  }

  refresh() {
    if (this.gridTable) {
      this.gridTable.refreshRowsData(this.jsonForm?.value);
    }
  }

  create(parent: number = 0) {

    this.crud.createCommonModal(this.translate.instant('common.create'),
      this.fields,
      data => this.http.post('/system/menu',
        Object.assign(data, {parent})).pipe(map(() => true)))
      .subscribe(next => next && this.search())
  }

  update(value: { [key: string]: any }) {
    this.crud.createCommonModal(this.translate.instant('common.update'),
      this.fields,
      data => this.http.put('/system/menu',
        Object.assign({id: value['id']}, data)).pipe(map(() => true)), value)
      .subscribe(next => next && this.refresh())
  }



  delete(parent: number) {
    this.crud.simpleDeleteConfirmModal(
      () => this.http.delete(`/system/menu/${parent}`).pipe(map(() => true)))
      .subscribe(() => this.search());
  }
}

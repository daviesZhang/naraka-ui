import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {map} from "rxjs";
import {GridTableComponent, RequestData} from "ngx-grid-table";
import {MeService} from "@core/services/me.service";
import {CurrentUser} from '@core/modal/me';
import {HttpClient} from "@angular/common/http";
import {changeDataToGridTree} from "@shared/utils/tools";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {JsonFormComponent} from "@shared/json-form/json-form.component";
import {GridOptions} from "ag-grid-community";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  gridOptions!: GridOptions;

  getData!: RequestData<{ [key: string]: any }>;

  me: CurrentUser;


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

  @ViewChild("cellButton",{static:true})
  cellButton!: TemplateRef<void>;

  constructor(public meService: MeService, private http: HttpClient,private translate:TranslateService) {
    this.me = <CurrentUser>this.meService.me$.value;
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
          headerName: 'url', field: 'url', cellRenderer: 'agGroupCellRenderer',
          showRowGroup: true
        },
        {headerName: 'code', field: 'code'},
        {headerName: 'parent', field: 'parent'},
        {headerName:  this.translate.instant('page.system.menu.remark.label'), field: 'remark'},
        {headerName: 'createdBy', field: 'createdBy'},
        {headerName: 'createdTime', field: 'createdTime'},

      ],

    }
  }
  test(node:any){
    console.log(node);
  }

  search(form:JsonFormComponent,grid:GridTableComponent){

    grid.refreshRowsData(form.form.value);

  }

}

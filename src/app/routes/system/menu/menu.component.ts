import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GridOptions} from "@ag-grid-enterprise/all-modules";
import {map} from "rxjs";
import {GridTableComponent, RequestData,TemplateRendererComponent} from "ngx-grid-table";
import {MeService} from "@core/services/me.service";
import {CurrentUser} from '@core/modal/me';
import {HttpClient} from "@angular/common/http";
import {changeDataToGridTree} from "@shared/utils/tools";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {JsonFormComponent} from "@shared/json-form/json-form.component";

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
          placeholder: '菜单唯一标识'
        }
      },
      {
        key: 'url',
        type: 'input',
        templateOptions: {
          label: '菜单链接',
          labelWidth: '80px',
          placeholder: '菜单链接'
        }
      }
    ]
  }];

  @ViewChild("cellButton",{static:true})
  cellButton!: TemplateRef<void>;

  constructor(public meService: MeService, private http: HttpClient) {
    this.me = <CurrentUser>this.meService.me$.value;
  }

  ngOnInit(): void {
    this.getData = (params) => {
      console.log(params);
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
        {headerName: 'remark', field: 'remark'},
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

import {Component, OnInit} from '@angular/core';
import {GridOptions} from "@ag-grid-enterprise/all-modules";
import {Observable, of} from "rxjs";
import {Statistics} from "ngx-grid-table";
import {MeService} from "@core/services/me.service";
import {CurrentUser} from '@core/modal/me';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  gridOptions!: GridOptions;
  getData!: (params: {
    [key: string]: any;
  }) => Observable<{
    total: number;
    items: any[];
    statistics?: Array<Statistics>;
  }>;

  me: CurrentUser;

  constructor(public meService: MeService) {
    this.me = <CurrentUser>this.meService.me$.value;
  }

  ngOnInit(): void {
    this.getData = () => {
      return of({items: [], total: 0})
    };
    this.gridOptions = {
      columnDefs: [{headerName: 'name'}],

    }
  }

}

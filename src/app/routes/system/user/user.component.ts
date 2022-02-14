import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Statistics} from "ngx-grid-table";
import {GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  gridOptions!: GridOptions;
  getData!: (params: {
    [key: string]: any;
  }) => Observable<{
    total: number;
    items: any[];
    statistics?: Array<Statistics>;
  }>;

  constructor() { }

  ngOnInit(): void {


  }

}

import {Component, OnInit} from '@angular/core';
import {MeService} from "@core/services/me.service";
import {filter, map, Observable, tap} from "rxjs";
import {CurrentUser} from "@core/modal/me";
import { getTreeData} from "@shared/utils/tools";
import {menu} from "@core/modal/menu";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  menu$: Observable<Array<any>>;

  menuList = menu;

  current$: Observable<CurrentUser>;

  constructor(private meService: MeService) {
    this.current$ = <Observable<CurrentUser>>this.meService.me$.pipe(filter(next => !!next));
    this.menu$ = this.current$.pipe(
      map(next => getTreeData(next.menus,{parent:item=>item.parent,id:item => item.id})));
  }

  ngOnInit(): void {


  }



}

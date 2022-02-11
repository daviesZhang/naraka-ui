import { Injectable } from '@angular/core';
import {fi_FI} from "ng-zorro-antd/i18n";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token_key = 'token';

  header_token_name = 'Authorization';

  constructor() { }



  saveToken(token:string):void{
    localStorage.setItem(this.token_key, token);
  }

  cleanToken(){
    localStorage.removeItem(this.token_key);
  }


  getToken():string|null{
    return localStorage.getItem(this.token_key);
  }

}

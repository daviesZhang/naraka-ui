import { Injectable } from '@angular/core';
import {fi_FI} from "ng-zorro-antd/i18n";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token_key = 'token';

  header_token_name = 'Authorization';

  constructor(private http:HttpClient) { }



  requestToken(data:{[key:string]:any}):Observable<string|null>{
    return this.http.post<HttpResponse<any>>("/admin/token", data, {observe: 'response'})
      .pipe(map(response => response.headers.get(this.header_token_name)));
  }

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

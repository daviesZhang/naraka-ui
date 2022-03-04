import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, tap, zip} from "rxjs";
import {CurrentUser, ICurrentUser} from "@core/modal/me";


@Injectable({
  providedIn: 'root'
})
export class MeService {

  me$ = new BehaviorSubject<CurrentUser | null>(null);

  constructor(private httpClient: HttpClient) {
  }


  me(): Observable<CurrentUser> {
    return zip(this.httpClient.get("/admin/system/menu/own"), this.httpClient.get<ICurrentUser>('/admin/me'))
      .pipe(map(([menus, user]) =>
        new CurrentUser(Object.assign({menus}, user))
      ), tap(next => this.me$.next(next)));
  }
}

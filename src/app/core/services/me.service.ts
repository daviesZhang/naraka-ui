import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {CurrentUser, ICurrentUser} from "@core/modal/me";


@Injectable({
  providedIn: 'root'
})
export class MeService {

  me$ = new BehaviorSubject<CurrentUser | null>(null);

  constructor(private httpClient: HttpClient) {
  }


  me(): Observable<CurrentUser> {
    return this.httpClient.get<ICurrentUser>('/me')
      .pipe(map(next=>new CurrentUser(next)),
        tap(next => this.me$.next(next)));
  }
}

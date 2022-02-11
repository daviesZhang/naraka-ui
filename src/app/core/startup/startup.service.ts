import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {MeService} from "@core/services/me.service";


/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
    constructor(
        private httpClient: HttpClient,
        private meService:MeService,
        private injector: Injector
    ) {

    }











    load(): Promise<any> {
      return firstValueFrom(this.meService.me());
    }
}
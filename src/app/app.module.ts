import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from '@shared/icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import {LayoutModule} from "./layout/layout.module";
import { RoutesModule } from './routes/routes.module';
import {SharedModule} from "@shared/shared.module";

registerLocaleData(zh);
export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  },

];
const INTERCEPTOR_PROVIDES = [
  // {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true}
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    RoutesModule,
    LayoutModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN },...INTERCEPTOR_PROVIDES,...APPINIT_PROVIDES],
  bootstrap: [AppComponent]
})
export class AppModule { }

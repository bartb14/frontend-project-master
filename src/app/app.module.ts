import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import localePl from '@angular/common/locales/pl'
registerLocaleData(localePl);

import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { registerLocaleData } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import {initializeKeycloak} from "./init/keycloak-init.factory";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    KeycloakAngularModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pl-PL'
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import {KeycloakEventType, KeycloakService} from "keycloak-angular";
import {DataService} from "../../services/data.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    currentTime = '';
    $timer: Subscription;
    $isLoggedIn: Subscription;
    isLoggedIn = false
    userRoles: string[];

    constructor(private dataService: DataService, private keycloakService: KeycloakService, private httpClient: HttpClient) {}

    @Output()
    addService = new EventEmitter<void>();

    async ngOnInit() {
        this.$timer = timer(0, 1000).subscribe(_ => {
            this.currentTime = new Date().toLocaleString();
        });
        this.$isLoggedIn = this.dataService.isLoggedIn.subscribe(isLoggedIn => {
          if (isLoggedIn === 'true') {
            this.isLoggedIn = true;
            this.userRoles = this.keycloakService.getUserRoles(true);
          } else if (isLoggedIn === 'false') {
            this.isLoggedIn = false;
          }
        })
    }

    ngOnDestroy() {
        this.$timer.unsubscribe();
        this.$isLoggedIn.unsubscribe();
    }

    onAddService() {
        this.addService.emit();
    }

    login() {
      this.keycloakService.login({})
    }

    logout() {
      window.location.href = "http://localhost:8080/realms/serwis/protocol/openid-connect/logout"
    }

}

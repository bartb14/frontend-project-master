import {KeycloakAuthGuard, KeycloakService} from "keycloak-angular";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthGuard extends KeycloakAuthGuard {

  constructor(
    protected readonly router: Router,
    protected readonly keycloakAngular: KeycloakService
  ) {
    super(router, keycloakAngular);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    if (!this.authenticated) {
      await this.keycloakAngular.login({
        redirectUri: window.location.origin + state.url
      });
    }

    return this.authenticated;
  }

}

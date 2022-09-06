import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable} from 'rxjs';
import { UserAdminService } from '../integration/service/userAdminService';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  routeURL: string;

  constructor(private router: Router, private userAdminService: UserAdminService) {
    this.routeURL = this.router.url;
    console.log(this.routeURL);
  }

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.userAdminService.userAdminValue;
    if (user){
      this.router.navigate(['/dashboard']);
      return false;
    }else {
      return true;
    }
  }

}

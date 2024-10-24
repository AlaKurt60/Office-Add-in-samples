import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { exhaustMap, Observable, take } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorservice implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('intercepttttt');
    return this.loginService.user?.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user || user.token == null) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}

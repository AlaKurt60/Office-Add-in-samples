import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from './user.model';

interface TokenData {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
  sub: string;
}
export interface BrugerModel {
  Afdeling: string;
  Initialer: string;
  Navn: string;
}
@Injectable({ providedIn: 'root' })
export class LoginService {
  datepipe = inject(DatePipe);

  url = 'http://localhost:54321/identityserverservice/connect/token';
  token = '';
  usdServerUrl = 'http://localhost:54321';

  httpClient = inject(HttpClient);
  user = new BehaviorSubject<User>(new User('', '', '', new Date()));

  login(username: string, password: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    var clientTime = this.datepipe.transform(new Date(), 'MM/dd/yyyy hh:mm:ss');
    var serviceNo = '99998';

    var modulSikkerhedResponse = this.GetModul();
    console.log(modulSikkerhedResponse);
    var secret =
      clientTime + '@' + this.EnCrypt(serviceNo + clientTime)?.toString();
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('client_id', 'Web')
      .set('client_secret', secret)
      .set('scope', 'api offline_access')
      .set('grant_type', 'password');
    const isSucces = false;
    return this.httpClient
      .post<TokenData>(this.url, body, { headers: headers })
      .pipe(
        catchError((errorRes) => {
          let errorMessage = 'Ukendt fejl';
          if (!errorRes.error || errorRes.error.error) {
            return throwError(() => new Error(errorMessage));
          }
          return throwError(() => new Error(errorRes.error));
        }),
        tap((resData) => {
          this.handleAuthentication(
            username,
            resData.sub,
            resData.access_token,
            +resData.expires_in
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    console.log(token);
    this.user.next(user);
    console.log(user);
  }

  EnCrypt(value: string) {
    var enc = CryptoJS.MD5(value);
    return enc.toString().toUpperCase();
  }

  GetModul() {
    return this.httpClient.get(
      this.usdServerUrl + '/api/generelt/modulsikkerhed'
    );
  }
}

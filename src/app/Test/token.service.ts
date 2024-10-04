import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

export interface ITokenData {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
  sub: string;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private datePipe = new DatePipe('en-US'); //Hvordan ændres den til dansk? da-DK virker ikke
  private httpClient = inject(HttpClient);
  url = 'http://localhost:54321/identityserverservice/connect/token';

  private identityServerURL =
    'http://localhost:54321/identityserverservice/connect/token';
  private username = 'kli';
  private password = 'kli';
  private token = '';
  private expirationDate = new Date();

  private EnCrypt(value: string) {
    var enc = CryptoJS.MD5(value);
    return enc.toString().toUpperCase();
  }

  private doHTTP() {
    console.log('TokenService.doHTTP');
    var serviceNo = '99998';
    var clientTime = this.datePipe.transform(new Date(), 'MM/dd/yyyy hh:mm:ss');
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    var secret =
      clientTime + '@' + this.EnCrypt(serviceNo + clientTime)?.toString();
    const body = new HttpParams()
      .set('username', this.username)
      .set('password', this.password)
      .set('client_id', 'Web')
      .set('client_secret', secret)
      .set('scope', 'api offline_access')
      .set('grant_type', 'password');

    return this.httpClient.post<ITokenData>(this.url, body, {
      headers: headers,
    });
  }

  getToken() {
    //Check if current token is valid.
    if (new Date() > this.expirationDate || this.token === '') {
      return this.doHTTP()
        .pipe(
          switchMap((res) => {
            this.token = res.access_token;
            this.expirationDate = new Date(
              new Date().getTime() + +res.expires_in * 1000
            );
            console.log(
              'TokenService.getToken switchMap! - res.expires_in=' +
                res.expires_in +
                ' expDate=' +
                this.expirationDate
            );
            return of(res);
          })
        )
        .pipe(
          catchError((errorRes) => {
            let errorMessage = 'Ukendt fejl';
            if (!errorRes.error || errorRes.error.error) {
              return throwError(
                () => new Error('ErrorMessage: ' + errorMessage)
              );
            }
            return throwError(() => new Error('Error: ' + errorRes.error));
          })
        );
    } else {
      console.log('TokenService.getToken return current token');
      return new Observable<ITokenData>((observer) => {
        const tokenData: ITokenData = {
          access_token: this.token,
          expires_in: '',
          refresh_token: '',
          sub: '',
          token_type: '',
        };
        observer.next(tokenData);
        observer.complete();
      });
    }
  }
}

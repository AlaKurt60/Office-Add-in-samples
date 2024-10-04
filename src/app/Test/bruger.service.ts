import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class BrugerService {
  brugereURL = 'http://localhost:54321/api/generelt/brugere';

  httpClient = inject(HttpClient); //remember to activate this feature in the app.config.ts file.
  tokenService = inject(TokenService);

  getBrugere() {
    //Hent en token.
    this.tokenService.getToken().subscribe((res) => {
      console.log('getBrugereTest token = ' + res.access_token);
      //Token modtaget. Vi henter bruger data
      const headers = new HttpHeaders().append(
        'Authorization',
        'Bearer ' + res.access_token
      );

      return this.httpClient.get(this.brugereURL, { headers: headers });
    });
    return 'Ingen data';
  }
}

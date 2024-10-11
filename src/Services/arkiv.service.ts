import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArkivMappe, ArkivMappeRoot } from '../Models/arkiv.model';
import { map, Observable, throwError } from 'rxjs';
import { NoterStruct } from '../Models/notetype.model';

@Injectable({ providedIn: 'root' })
export class ArkivService {
  usdServerUrl = 'http://localhost:54321/';
  map = new Map<number, string>();
  koder: string[] = [];

  constructor(private httpClient: HttpClient) {}

  getArkivMapper(url: string): Observable<ArkivMappe[]> {
    var url = this.getAbsolutUrl(url);
    var arkivMapper: ArkivMappe[] = [];
    console.log('Url arkiv ' + url);
    return this.httpClient.get<ArkivMappeRoot>(url).pipe(
      map((data: ArkivMappeRoot) => {
        console.log('Arkiv first');
        console.log(data);
        var res = data['MapperReadonly'];
        console.log('Arkiv');
        console.log(res);
        // var idIndex = 0;
        // res.$values.forEach((q) => {
        //   q.DisplayTekst = q.Navn;
        //   q.id = idIndex;
        //   idIndex++;
        // });
        return arkivMapper;
      })
    );
  }

  getAbsolutUrl(urlPart: String) {
    return this.usdServerUrl + urlPart;
  }
}

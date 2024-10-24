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
  arkivMapper: ArkivMappe[] = [];

  constructor(private httpClient: HttpClient) {}

  getArkivMapper(optionSelected: any): Observable<ArkivMappe[]> {
    var url = this.getAbsolutUrl(optionSelected.getArkivUrlPart());
    console.log('Url arkiv ' + url);
    return this.httpClient.get<ArkivMappeRoot>(url).pipe(
      map((data: ArkivMappeRoot) => {
        var res = data.MapperReadonly.$values; //['MapperReadonly'];
        var idIndex = 1;
        res.forEach((q) => {
          q.DisplayTekst = q.Navn;
          q.unikId = idIndex;
          idIndex++;
        });
        console.log('Mapper');
        console.log(res);
        this.arkivMapper = optionSelected.getMapper(res);
        return res;
      })
    );
  }

  getAbsolutUrl(urlPart: String) {
    return this.usdServerUrl + urlPart;
  }
}

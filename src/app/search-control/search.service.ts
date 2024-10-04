import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Lejer, LejerStruct } from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { Note, NoterStruct } from '../../Models/notetype.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  usdServerUrl = 'http://localhost:54321/';
  map = new Map<number, string>();
  koder: string[] = [];

  constructor(private httpClient: HttpClient) {
    this.Init();
  }
  lejer: Lejer[] = [];

  Init() {
    this.map.set(StamkortEnum.Lejer, 'api/bolig/lejere');
    this.map.set(StamkortEnum.Bygning, 'api/query/bolig/bygningSoegning');
    this.map.set(StamkortEnum.Lejemaal, 'api/query/bolig/bygningSoegning');
    this.map.set(StamkortEnum.Finansenhed, 'api/query/bolig/bygningSoegning');
    this.map.set(StamkortEnum.Ejendom, 'api/query/bolig/bygningSoegning');
    this.map.set(StamkortEnum.Kreditor, 'api/query/bolig/bygningSoegning');
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    errorMessage = `An error has occurred: ${err.error.message}`;
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }

  getNoteTyper(): Observable<Note[]> {
    var url = this.getAbsolutUrl('api/generelt/koder');
    return this.httpClient.get<NoterStruct>(url).pipe(
      map((data: NoterStruct) => {
        var res = data['$values'];
        console.log('Noter');
        console.log(res);
        var idIndex = 0;
        res = res.filter(
          (q) => q.ErSynlig == true && q.$type.includes('tyyype')
        );
        console.log('Noter 2');
        console.log(res);
        res.forEach((q) => {
          q.DisplayTekst = q.Tekst + ', ' + q.$type;
          q.id = idIndex;
          idIndex++;
        });
        return res;
      })
    );
  }

  searchLejer(key: number, soegetekst: string): Observable<Lejer[]> {
    var url = this.getApiUrl(key, soegetekst);
    switch (key) {
      case StamkortEnum.Lejer: {
        return this.doSearchLejer(url);
      }
    }
    return new Observable<any[]>();
  }

  private getApiUrl(key: number, soegetekst: string) {
    var apiUrl = this.map.get(key) ?? '';
    return this.getAbsolutUrl(apiUrl) + '?soegeTekst=' + soegetekst;
  }

  private doSearchLejer(url: string) {
    return this.httpClient.get<LejerStruct>(url).pipe(
      map((data: LejerStruct) => {
        var res = data['$values'];
        var idIndex = 0;
        res.forEach((q) => {
          this.setDisplayTekstLejer(q);
          q.id = idIndex;
          idIndex++;
        });
        return res;
      })
    );
  }

  private setDisplayTekstLejer(lejer: Lejer) {
    lejer.DisplayTekst =
      lejer.LejerstrengReadonly +
      ', ' +
      lejer.NavnReadonly +
      ', ' +
      lejer.Adresse1Readonly +
      ', ' +
      lejer.Adresse2Readonly +
      ', ' +
      lejer.LejerStatusString;
    return lejer;
  }

  //[Route(@"api/esdh/{kartotek}/{id}/journalplan/mapper")]
  VisMapper() {
    //var url = this.getAbsolutUrl('api/esdh/{0}/{1}/journalplan/mapper');
    var url = this.getAbsolutUrl('api/esdh/lejere/3178/journalplan/mapper');
    return this.httpClient.get<object[]>(url);
  }

  getAbsolutUrl(urlPart: String) {
    return this.usdServerUrl + urlPart;
  }
}

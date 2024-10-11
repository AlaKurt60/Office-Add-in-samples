import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { Lejer, LejerStruct } from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { Note, NoterStruct } from '../../Models/notetype.model';
import { Bygning, BygningStruct } from '../../Models/bygning.model';
import { Lejemaal, LejemaalStruct } from '../../Models/lejemaal.model';
import { Finansenhed, FinansenhedStruct } from '../../Models/finansenhed.model';
import { LejerMapper } from '../../Mapper/lejerMapper';
import { BygningMapper } from '../../Mapper/bygningMapper';

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
    this.map.set(StamkortEnum.Lejemål, 'api/query/bolig/lejemaalSoegning');
    this.map.set(StamkortEnum.Finansenhed, 'api/query/finans/finansenheder');
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
    var url = this.getAbsolutUrl('api/generelt/koderfornotetypes');
    return this.httpClient.get<NoterStruct>(url).pipe(
      map((data: NoterStruct) => {
        var res = data['$values'];
        console.log('Noter');
        console.log(res);
        var idIndex = 0;
        res.forEach((q) => {
          q.DisplayTekst = q.Tekst;
          q.id = idIndex;
          idIndex++;
        });
        return res;
      })
    );
  }

  searchOptions(key: number, soegetekst: string): Observable<any[]> {
    var url = this.getApiUrl(key, soegetekst);
    switch (key) {
      case StamkortEnum.Lejer: {
        return this.searchLejer(url);
      }
      case StamkortEnum.Bygning: {
        return this.searchBygning(url);
      }
      case StamkortEnum.Lejemål: {
        return this.searchLejemaal(url);
      }
      case StamkortEnum.Finansenhed: {
        return this.searchFinansenhed(url);
      }
    }
    return new Observable<any[]>();
  }

  private searchFinansenhed(url: string) {
    return this.httpClient.get<FinansenhedStruct>(url).pipe(
      map((data: FinansenhedStruct) => {
        var res = data['$values'];
        var idIndex = 0;
        res.forEach((q) => {
          this.setDisplayTekstFinansenhed(q);
          q.id = idIndex;
          idIndex++;
        });
        return res;
      })
    );
  }

  private searchLejemaal(url: string) {
    return this.httpClient.get<LejemaalStruct>(url).pipe(
      map((data: LejemaalStruct) => {
        var res = data['$values'];
        var idIndex = 0;
        res.forEach((q) => {
          this.setDisplayTekstLejemaal(q);
          q.id = idIndex;
          idIndex++;
        });
        return res;
      })
    );
  }

  private searchBygning(url: string) {
    return this.httpClient.get<BygningStruct>(url).pipe(
      map((data: BygningStruct) => {
        return BygningMapper.map(data['$values']);
      })
    );
  }

  private searchLejer(url: string) {
    return this.httpClient.get<LejerStruct>(url).pipe(
      map((data: LejerStruct) => {
        return LejerMapper.map(data['$values']);
      })
    );
  }

  private setDisplayTekstFinansenhed(finansenhed: Finansenhed) {
    finansenhed.DisplayTekst =
      finansenhed.FinselskabNr + ' - ' + finansenhed.Navn;
    return finansenhed;
  }

  private setDisplayTekstLejemaal(lejemaal: Lejemaal) {
    lejemaal.DisplayTekst =
      lejemaal.LejemaalstrengReadonly +
      ', ' +
      lejemaal.Adresse1Readonly +
      this.addIfNotNull(lejemaal.Adresse2Readonly);
    ', ' + lejemaal.Adresse2Readonly;
    return lejemaal;
  }

  private addIfNotNull(tekst?: string) {
    return tekst != null && tekst != '' ? ', ' + tekst : '';
  }

  private getApiUrl(key: number, soegetekst: string) {
    var apiUrl = this.map.get(key) ?? '';
    return this.getAbsolutUrl(
      apiUrl + '?soegeTekst=' + soegetekst + '&maxrecords=150'
    );
  }

  getAbsolutUrl(urlPart: String) {
    return this.usdServerUrl + urlPart;
  }
}

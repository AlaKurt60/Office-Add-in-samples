import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import {
  BygningStamkort,
  IStamkort,
  Lejer,
  LejerStamkort,
  LejerStruct,
} from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { Note, NoterStruct } from '../../Models/notetype.model';
import { Bygning, BygningStruct } from '../../Models/bygning.model';
import { Lejemaal, LejemaalStruct } from '../../Models/lejemaal.model';
import { Finansenhed, FinansenhedStruct } from '../../Models/finansenhed.model';
import { LejerMapper } from '../../Mapper/lejerMapper';
import { BygningMapper } from '../../Mapper/bygningMapper';
import { StringUtility } from '../../Helper/string.utility';
import { SelskabStruct } from '../../Models/selskab.model';
import { SelskabMapper } from '../../Mapper/selskabMapper';
import { AnsogerMapper } from '../../Mapper/ansogerMapper';
import { AnsogerStruct } from '../../Models/ansoger.model';
import { LejemaalMapper } from '../../Mapper/lejemaalMapper';
import { FinansenhedMapper } from '../../Mapper/finansenhedMapper';
import { EjendomStruct } from '../../Models/ejendom.model';
import { EjendomMapper } from '../../Mapper/ejendomMapper';
import { KreditorStruct } from '../../Models/kreditor.model';
import { KreditorMapper } from '../../Mapper/kreditorMapper';

@Injectable({ providedIn: 'root' })
export class SearchService {
  usdServerUrl = 'http://localhost:54321/';
  apiUrlmap = new Map<number, string>();
  koder: string[] = [];

  constructor(private httpClient: HttpClient) {}

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
          q.unikId = idIndex;
          idIndex++;
        });
        return res;
      })
    );
  }

  ttt(stamkort: IStamkort) {
    stamkort.search('');
  }

  searchOptions(key: number, soegetekst: string): Observable<any[]> {
    var url = StringUtility.getApiUrl(key, soegetekst);
    // var byg = new BygningStamkort(this.httpClient);
    // return byg.search(soegetekst);

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
      case StamkortEnum.Selskab: {
        return this.searchSelskab(url);
      }
      case StamkortEnum.Ansøger: {
        return this.searchAnsoger(url);
      }
      case StamkortEnum.Ejendom: {
        return this.searchEjendom(url);
      }
      case StamkortEnum.Kreditor: {
        return this.searchKreditor(url);
      }
    }
    return new Observable<any[]>();
  }

  private searchKreditor(url: string) {
    return this.httpClient.get<KreditorStruct>(url).pipe(
      map((data: KreditorStruct) => {
        console.log(data['$values']);
        return KreditorMapper.map(data['$values']);
      })
    );
  }

  private searchEjendom(url: string) {
    return this.httpClient.get<EjendomStruct>(url).pipe(
      map((data: EjendomStruct) => {
        console.log(data['$values']);
        return EjendomMapper.map(data['$values']);
      })
    );
  }

  private searchFinansenhed(url: string) {
    return this.httpClient.get<FinansenhedStruct>(url).pipe(
      map((data: FinansenhedStruct) => {
        return FinansenhedMapper.map(data['$values']);
      })
    );
  }

  private searchLejemaal(url: string) {
    return this.httpClient.get<LejemaalStruct>(url).pipe(
      map((data: LejemaalStruct) => {
        return LejemaalMapper.map(data['$values']);
      })
    );
  }

  private searchSelskab(url: string) {
    return this.httpClient.get<SelskabStruct>(url).pipe(
      map((data: SelskabStruct) => {
        return SelskabMapper.map(data['$values']);
      })
    );
  }

  private searchAnsoger(url: string) {
    return this.httpClient.get<AnsogerStruct>(url).pipe(
      map((data: AnsogerStruct) => {
        return AnsogerMapper.map(data['$values']);
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

  private searchLejerAsArray(url: string) {
    return this.httpClient.get<LejerStruct>(url).pipe(
      map((data: LejerStruct) => {
        return LejerMapper.map(data['$values'] as Lejer[]);
      })
    );
  }

  private searchLejer(url: string) {
    return this.httpClient.get<LejerStruct>(url).pipe(
      map((data: LejerStruct) => {
        console.log(data['$values']);

        return LejerMapper.map(data['$values']);
      })
    );
  }

  private setDisplayTekstLejemaal(lejemaal: Lejemaal) {}

  private addIfNotNull(tekst?: string) {
    return tekst != null && tekst != '' ? ', ' + tekst : '';
  }

  private getApiUrl(key: number, soegetekst: string) {
    var apiUrl = this.apiUrlmap.get(key) ?? '';
    return this.getAbsolutUrl(
      apiUrl + '?soegeTekst=' + soegetekst + '&maxrecords=150'
    );
  }

  getAbsolutUrl(urlPart: String) {
    return this.usdServerUrl + urlPart;
  }
}

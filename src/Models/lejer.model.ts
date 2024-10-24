import { HttpClient } from '@angular/common/http';
import { StringUtility } from '../Helper/string.utility';
import { IModel } from '../Interface/imodel.model';
import { ArkivMappe } from './arkiv.model';
import { Bygning, BygningStruct } from './bygning.model';
import { map, Observable } from 'rxjs';
import { LejerMapper } from '../Mapper/lejerMapper';
import { StamkortEnum } from '../app/Enums/stamkort.enum';
import { BygningMapper } from '../Mapper/bygningMapper';
import { Injectable } from '@angular/core';

export interface LejerStruct {
  $type: string;
  $values: Lejer[];
}
export interface IStamkort {
  stamkortId: number;
  navn: string;
  getArkivUrlPart(model: IModel): string;
  getArkivMapper(model: IModel): ArkivMappe[];
  search(soegeTekst: string): Observable<any[]>;
}

export class LejerStamkort implements IStamkort {
  stamkortId = StamkortEnum.Lejer;
  navn = 'Lejer';

  constructor(private httpClient: HttpClient) {}

  getArkivUrlPart(lejer: Lejer): string {
    return 'api/esdh/lejere/' + lejer.IdReadonly + '/journalplan/mapper';
  }

  search(soegeTekst: string): Observable<Lejer[]> {
    var url = StringUtility.getApiUrl(this.stamkortId, soegeTekst);
    alert(url);
    return this.httpClient.get<LejerStruct>(url).pipe(
      map((data: LejerStruct) => {
        console.log(data['$values']);
        return LejerMapper.map(data['$values']);
      })
    );
  }

  getArkivMapper(model: IModel): ArkivMappe[] {
    //Opret rodmappe
    // return mapper;
    return [];
  }
}

export class BygningStamkort implements IStamkort {
  stamkortId = StamkortEnum.Bygning;
  navn = 'Bygning';

  constructor(private httpClient: HttpClient) {}

  getArkivUrlPart(lejer: Lejer): string {
    return 'api/esdh/lejere/' + lejer.IdReadonly + '/journalplan/mapper';
  }

  search(soegeTekst: string): Observable<Bygning[]> {
    var url = StringUtility.getApiUrl(this.stamkortId, soegeTekst);
    return this.httpClient.get<BygningStruct>(url).pipe(
      map((data: BygningStruct) => {
        console.log(data['$values']);
        return BygningMapper.map(data['$values']);
      })
    );
  }

  getArkivMapper(model: IModel): ArkivMappe[] {
    //Opret rodmappe
    // return mapper;
    return [];
  }
}

export class Lejer implements IModel {
  IdReadonly: string;
  LejerstrengReadonly: string;
  NavnReadonly: string;
  EjendomNrReadonly: number;
  SelskabNrReadonly: number;
  LejerNrReadonly: number;
  LejemaalNrReadonly: number;
  Adresse1Readonly: string;
  EmailReadonly: string;
  Adresse2Readonly: string;
  PostNrReadonly: string;
  KontaktIdReadOnly: number;
  LejerStatusString: string;
  DisplayTekst: string = '';
  unikId: number;

  constructor(lejer: Lejer, id: number) {
    this.unikId = id;
    this.IdReadonly = lejer.IdReadonly;
    this.LejerstrengReadonly = lejer.LejerstrengReadonly;
    this.NavnReadonly = lejer.NavnReadonly;
    this.EjendomNrReadonly = lejer.EjendomNrReadonly;
    this.SelskabNrReadonly = lejer.SelskabNrReadonly;
    this.LejerNrReadonly = lejer.LejerNrReadonly;
    this.LejemaalNrReadonly = lejer.LejemaalNrReadonly;
    this.Adresse1Readonly = lejer.Adresse1Readonly;
    this.EmailReadonly = lejer.EmailReadonly;
    this.Adresse2Readonly = lejer.Adresse2Readonly;
    this.PostNrReadonly = lejer.PostNrReadonly;
    this.KontaktIdReadOnly = lejer.KontaktIdReadOnly;
    this.LejerStatusString = lejer.LejerStatusString;

    this.setDisplayTekst();
  }

  setDisplayTekst() {
    this.DisplayTekst =
      this.LejerstrengReadonly +
      StringUtility.addIfNotNullOrEmpty(this.NavnReadonly) +
      StringUtility.addIfNotNullOrEmpty(this.Adresse1Readonly) +
      StringUtility.addIfNotNullOrEmpty(this.Adresse2Readonly) +
      StringUtility.addIfNotNullOrEmpty(this.LejerStatusString);
  }

  getArkivUrlPart(): string {
    return 'api/esdh/lejere/' + this.IdReadonly + '/journalplan/mapper';
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = `\\Lejer ${this.LejerstrengReadonly}-${this.NavnReadonly}`;
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }
}

import { IModel } from '../Interface/imodel.model';
import { StringUtility } from '../Helper/string.utility';
import { ArkivMappe } from './arkiv.model';
import { map } from 'rxjs';

export interface EjendomStruct {
  $type: string;
  $values: Ejendom[];
}

export class Ejendom implements IModel {
  Id: number;
  Nr: number;
  SelskabNr: number;
  VirksomhedsNr: number | null;
  EjendomInfo?: EjendomInfo;
  Landsbyggefonden?: EjendomInfo;
  AdministrationsPeriode?: AdministrationsPeriode;
  Lokation?: Lokation;
  WebShop?: WebShop;
  KoebsInfo?: EjendomInfo;
  SalgsInfo?: EjendomInfo;
  EjendomType?: EjendomInfo;
  OpforelsesDato: Date | null;
  CvrNummer: null | string;
  BBREjendomNr: string;
  BBREjendomTekst: string;
  FinansselskabNr: number;
  NormalIstandMetodeFraDato?: Date;
  NormalIstandMetodeFaellesBKonto?: boolean;
  NormalIstandMetodeKodeId: null;
  Hjemmeside: null | string;
  EjendomsGrupperKodeIder: EjendomsGrupperKodeIder;
  SeNr: null | string;
  DisplayTekst: string;
  unikId: number;

  constructor(ejendom: Ejendom, id: number) {
    this.Id = ejendom.Id;
    this.Nr = ejendom.Nr;
    this.SelskabNr = ejendom.SelskabNr;
    this.VirksomhedsNr = ejendom.VirksomhedsNr;
    this.EjendomInfo = ejendom.EjendomInfo;
    this.Landsbyggefonden = ejendom.Landsbyggefonden;
    this.AdministrationsPeriode = ejendom.AdministrationsPeriode;
    this.Lokation = ejendom.Lokation;
    this.WebShop = ejendom.WebShop;
    this.KoebsInfo = ejendom.KoebsInfo;
    this.SalgsInfo = ejendom.SalgsInfo;
    this.EjendomType = ejendom.EjendomType;
    this.OpforelsesDato = ejendom.OpforelsesDato;
    this.CvrNummer = ejendom.CvrNummer;
    this.BBREjendomNr = ejendom.BBREjendomNr;
    this.BBREjendomTekst = ejendom.BBREjendomTekst;
    this.FinansselskabNr = ejendom.FinansselskabNr;
    this.NormalIstandMetodeFraDato = ejendom.NormalIstandMetodeFraDato;
    this.NormalIstandMetodeFaellesBKonto =
      ejendom.NormalIstandMetodeFaellesBKonto;
    this.NormalIstandMetodeKodeId = ejendom.NormalIstandMetodeKodeId;
    this.Hjemmeside = ejendom.Hjemmeside;
    this.EjendomsGrupperKodeIder = ejendom.EjendomsGrupperKodeIder;
    this.SeNr = ejendom.SeNr;
    this.DisplayTekst = ejendom.DisplayTekst;
    this.unikId = id;
    this.setDisplayTekst();
  }

  setDisplayTekst() {
    this.DisplayTekst =
      `${this.SelskabNr}-${this.Nr} ` +
      StringUtility.addIfNotNullOrEmpty(this.EjendomInfo?.Navn) +
      StringUtility.addIfNotNullOrEmpty(this.Lokation?.Adresse.AdresseLinie1) +
      StringUtility.addIfNotNullOrEmpty(this.Lokation?.Adresse.AdresseLinie2);
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = `\\Ejendom ${this.SelskabNr}-${this.Nr} ${this.EjendomInfo?.Navn}`;
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }

  getArkivUrlPart(): string {
    //   api/esdh/ejendomme/37/journalplan/mapper
    return `api/esdh/ejendomme/${this.Id}/journalplan/mapper`;
  }
}

export interface WebShop {
  $type: string;
  LoginUrl: null | string;
  UserName: null | string;
  PassWord: null | string;
  DefaultAccount: null | string;
  CreditorId: number | null;
}

export interface Adresse {
  $type: string;
  AdresseLinie1: string;
  AdresseLinie2: string;
  PostNr: string;
}

export interface Lokation {
  $type: string;
  Adresse: Adresse;
  KommuneNr: number | null;
  Beliggenhed: null;
  Matrikel: null;
  GeoplaceringKodeId: number | null;
  LokationKodeId: null;
  GeoPositionBreddegrad: number | null;
  GeoPositionLaengdegrad: number | null;
}

export interface EjendomInfo {
  $type: string;
  Navn?: string;
  KodeId?: number | null;
  KoebsDato?: Date | null;
  Nr?: null | string;
  SalgsDato?: Date | null;
}

export interface AdministrationsPeriode {
  $type: string;
  StartDato: Date | null;
  StopDato: Date | null;
}

export interface EjendomsGrupperKodeIder {
  $type: Type;
  $values: number[];
}

export enum Type {
  SystemInt32Mscorlib = 'System.Int32[], mscorlib',
}

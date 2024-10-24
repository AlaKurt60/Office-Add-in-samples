import { StamkortEnum } from '../app/Enums/stamkort.enum';
import { StringUtility } from '../Helper/string.utility';
import { IModel } from '../Interface/imodel.model';
import { ArkivMappe } from './arkiv.model';

export interface SelskabStruct {
  $type: string;
  $values: Selskab[];
}

export interface Adresse {
  $type: string;
  AdresseLinie1: string;
  AdresseLinie2: string;
  PostNr: string;
  EnableChangeTrackingAndNotifaction: boolean;
}

export class Selskab implements IModel {
  SelskabNr: number;
  SelskabNavn: string;
  Adresse: Adresse;
  DisplayTekst: string;
  unikId: number;

  constructor(selskab: Selskab, id: number) {
    this.unikId = id;
    this.SelskabNr = selskab.SelskabNr;
    this.SelskabNavn = selskab.SelskabNavn;
    this.Adresse = selskab.Adresse;
    this.DisplayTekst = selskab.DisplayTekst;
    this.setDisplayTekst();
  }

  setDisplayTekst() {
    this.DisplayTekst =
      this.SelskabNr +
      StringUtility.addIfNotNullOrEmpty(this.SelskabNavn) +
      StringUtility.addIfNotNullOrEmpty(this.Adresse.AdresseLinie1) +
      StringUtility.addIfNotNullOrEmpty(this.Adresse.AdresseLinie2);
  }

  getArkivUrlPart(): string {
    return 'api/esdh/selskaber/' + this.SelskabNr + '/journalplan/mapper';
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = '\\Selskab '; //${this.SelskabNr}-${this.Nr} ${this.EjendomInfo?.Navn}`;''
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }
}

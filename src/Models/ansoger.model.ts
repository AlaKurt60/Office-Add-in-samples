import { StringUtility } from '../Helper/string.utility';
import { IModel } from '../Interface/imodel.model';
import { ArkivMappe } from './arkiv.model';

export interface AnsogerStruct {
  $type: string;
  $values: Ansoger[];
}

export class Ansoger implements IModel {
  AnsoegerSelskabNrReadonly: number;
  AnsogerIdReadonly: number;
  AnsogerNrReadonly: number;
  AnsoegerPersonIdReadonly: number;
  NavnReadonly: string;
  FoedselsDatoReadonly: Date;
  EmailReadonly: string;
  KontaktIdReadOnly: number;
  DisplayTekst: string;
  unikId: number;

  constructor(ansoger: Ansoger, id: number) {
    this.unikId = id;
    this.AnsoegerSelskabNrReadonly = ansoger.AnsoegerSelskabNrReadonly;
    this.AnsogerIdReadonly = ansoger.AnsogerIdReadonly;
    this.AnsogerNrReadonly = ansoger.AnsogerNrReadonly;
    this.AnsoegerPersonIdReadonly = ansoger.AnsoegerPersonIdReadonly;
    this.NavnReadonly = ansoger.NavnReadonly;
    this.FoedselsDatoReadonly = ansoger.FoedselsDatoReadonly;
    this.EmailReadonly = ansoger.EmailReadonly;
    this.KontaktIdReadOnly = ansoger.KontaktIdReadOnly;
    this.DisplayTekst = ansoger.DisplayTekst;
    this.setDisplayTekst();
  }

  setDisplayTekst() {
    this.DisplayTekst =
      this?.AnsoegerSelskabNrReadonly +
      '-' +
      this?.AnsogerNrReadonly +
      StringUtility.addIfNotNullOrEmpty(this?.NavnReadonly) +
      StringUtility.addIfNotNullOrEmpty(this?.FoedselsDatoReadonly.toString());
  }

  getArkivUrlPart(): string {
    return (
      'api/esdh/ansoegere/' +
      this.AnsoegerPersonIdReadonly +
      '/journalplan/mapper'
    );
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = '\\Ansøger '; //${this.SelskabNr}-${this.Nr} ${this.EjendomInfo?.Navn}`;''
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }
}

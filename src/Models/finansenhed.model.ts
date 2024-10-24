import { IModel } from '../Interface/imodel.model';
import { ArkivMappe } from './arkiv.model';

export interface FinansenhedStruct {
  $type: string;
  $values: Finansenhed[];
}

export class Finansenhed implements IModel {
  FinselskabId: number;
  FinselskabNr: number;
  Navn: null | string;
  DisplayTekst!: string;
  unikId: number;

  constructor(finansenhed: Finansenhed, id: number) {
    this.unikId = id;
    this.FinselskabId = finansenhed.FinselskabId;
    this.FinselskabNr = finansenhed.FinselskabNr;
    this.Navn = finansenhed.Navn;
    this.setDisplayTekst();
  }
  setDisplayTekst(): void {
    this.DisplayTekst = this.FinselskabNr + ' - ' + this.Navn;
  }

  getArkivUrlPart(): string {
    // api/esdh/finansenheder/86/journalplan/mapper
    return (
      'api/esdh/finansenheder/' + this.FinselskabId + '/journalplan/mapper'
    );
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = '\\Finansenhed '; //${this.SelskabNr}-${this.Nr} ${this.EjendomInfo?.Navn}`;''
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }
}

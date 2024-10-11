import { IModel } from '../Interface/imodel.model';

export interface FinansenhedStruct {
  $type: string;
  $values: Finansenhed[];
}

export class Finansenhed implements IModel {
  FinselskabId: number;
  FinselskabNr: number;
  Navn: null | string;
  DisplayTekst: string;
  id: number;

  // Constructor that accepts a Finansenhed object
  constructor(finansenhed: Finansenhed) {
    this.FinselskabId = finansenhed.FinselskabId;
    this.FinselskabNr = finansenhed.FinselskabNr;
    this.Navn = finansenhed.Navn;
    this.DisplayTekst = finansenhed.DisplayTekst || ''; // Default to empty string if not provided
    this.id = finansenhed.id;
  }

  getArkivUrlPart(): string {
    return 'api/esdh/finansenhed/' + this.FinselskabId;
  }
}

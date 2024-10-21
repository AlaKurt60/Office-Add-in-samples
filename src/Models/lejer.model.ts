import { StringUtility } from '../Helper/string.utility';
import { IModel } from '../Interface/imodel.model';

export interface LejerStruct {
  $type: string;
  $values: Lejer[];
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
  id: number;

  constructor(lejer: Lejer, id: number) {
    this.id = id;
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

  private setDisplayTekst() {
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
  getArkivMappe() {
    //Opret rodmappe
    // return mapper;
  }
}

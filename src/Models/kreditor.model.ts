import { IModel } from '../Interface/imodel.model';
import { ArkivMappe } from './arkiv.model';

export interface KreditorStruct {
  $type: string;
  $values: Kreditor[];
}

export class Kreditor implements IModel {
  $type: string;
  KreditorIdReadOnly: number;
  KreditorSoegeNoegleReadOnly: string;
  NavnReadonly: string;
  FinSelskabNrReadOnly: number | null;
  EmailReadOnly: null | string;
  CvrNrReadOnly: null | string;
  TelefonArbejdeReadOnly: null | string;
  TelefonMobilReadOnly: null;
  TelefonDirekteReadOnly: null;
  TelefonPrivatReadOnly: null;
  Navn2Readonly: null;
  EjendomIdReadOnly: number | null;
  KontaktIdReadOnly: number;
  unikId: number;
  DisplayTekst!: string;

  constructor(kreditor: Kreditor, unikId: number) {
    this.unikId = unikId;
    this.$type = kreditor.$type;
    this.KreditorIdReadOnly = kreditor.KreditorIdReadOnly;
    this.KreditorSoegeNoegleReadOnly = kreditor.KreditorSoegeNoegleReadOnly;
    this.NavnReadonly = kreditor.NavnReadonly;
    this.FinSelskabNrReadOnly = kreditor.FinSelskabNrReadOnly;
    this.EmailReadOnly = kreditor.EmailReadOnly;
    this.CvrNrReadOnly = kreditor.CvrNrReadOnly;
    this.TelefonArbejdeReadOnly = kreditor.TelefonArbejdeReadOnly;
    this.TelefonMobilReadOnly = kreditor.TelefonMobilReadOnly;
    this.TelefonDirekteReadOnly = kreditor.TelefonDirekteReadOnly;
    this.TelefonPrivatReadOnly = kreditor.TelefonPrivatReadOnly;
    this.Navn2Readonly = kreditor.Navn2Readonly;
    this.EjendomIdReadOnly = kreditor.EjendomIdReadOnly;
    this.KontaktIdReadOnly = kreditor.KontaktIdReadOnly;
    this.setDisplayTekst();
  }

  setDisplayTekst() {
    this.DisplayTekst =
      this.KreditorSoegeNoegleReadOnly + ' - ' + this.NavnReadonly;
  }

  getArkivUrlPart(): string {
    return `api/esdh/kreditorer/${this.KreditorIdReadOnly}/journalplan/mapper`;
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = '\\Kreditor '; //${this.SelskabNr}-${this.Nr} ${this.EjendomInfo?.Navn}`;''
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }
}

import { IModel } from '../Interface/imodel.model';
import { StringUtility } from '../Helper/string.utility';
import { ArkivMappe } from './arkiv.model';

export interface BygningStruct {
  $type: string;
  $values: Bygning[];
}

export class Bygning implements IModel {
  BygningId: number;
  SelskabNrReadOnly: number;
  EjendomNrReadOnly: number;
  BygningNrReadOnly: number;
  BygningNavnReadOnly: string;
  Adresse1: null | string;
  Adresse2: null;
  DisplayTekst: string = '';
  unikId: number;
  arkivMapper?: ArkivMappe[];

  constructor(bygning: Bygning, id: number) {
    this.unikId = id;
    this.BygningId = bygning.BygningId;
    this.SelskabNrReadOnly = bygning.SelskabNrReadOnly;
    this.EjendomNrReadOnly = bygning.EjendomNrReadOnly;
    this.BygningNrReadOnly = bygning.BygningNrReadOnly;
    this.BygningNavnReadOnly = bygning.BygningNavnReadOnly;
    this.Adresse1 = bygning.Adresse1;
    this.Adresse2 = bygning.Adresse2;
    this.setDisplayTekst();
  }

  setDisplayTekst() {
    this.DisplayTekst =
      this.SelskabNrReadOnly +
      StringUtility.addIfNotNull(this.EjendomNrReadOnly) +
      StringUtility.addIfNotNull(this.BygningNrReadOnly) +
      StringUtility.addIfNotNullOrEmpty(this.BygningNavnReadOnly);
  }

  getArkivUrlPart(): string {
    return 'api/esdh/bygninger/' + this.BygningId + '/journalplan/mapper';
  }

  getMapper(mapper: ArkivMappe[]): ArkivMappe[] {
    var displayTekst = '\\Bygning '; //${this.SelskabNr}-${this.Nr} ${this.EjendomInfo?.Navn}`;''
    var rodmappe = new ArkivMappe(displayTekst);
    mapper.unshift(rodmappe);
    return mapper;
  }
}
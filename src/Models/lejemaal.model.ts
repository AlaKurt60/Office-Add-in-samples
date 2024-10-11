import { IModel } from '../Interface/imodel.model';

export interface LejemaalStruct {
  $type: string;
  $values: Lejemaal[];
}

export class Lejemaal implements IModel {
  IdReadonly: number;
  LejemaalstrengReadonly: string;
  EjendomNrReadonly: number;
  SelskabNrReadonly: number;
  LejemaalNrReadonly: number;
  Adresse1Readonly: string;
  Adresse2Readonly?: string;
  PostNrReadonly: string;
  BygningNrReadonly?: string;
  BoligTypeKodeIdReadonly: number;
  AntalRumReadonly: number;
  AntalKamreReadonly: number;
  EtageReadonly?: string;
  PositionReadOnly?: string;
  EnableChangeTrackingAndNotifaction: boolean;
  DisplayTekst: string;
  id: number;

  // Constructor that accepts a Lejemaal object
  constructor(lejemaal: Lejemaal, id: number) {
    this.id = id;
    this.IdReadonly = lejemaal.IdReadonly;
    this.LejemaalstrengReadonly = lejemaal.LejemaalstrengReadonly;
    this.EjendomNrReadonly = lejemaal.EjendomNrReadonly;
    this.SelskabNrReadonly = lejemaal.SelskabNrReadonly;
    this.LejemaalNrReadonly = lejemaal.LejemaalNrReadonly;
    this.Adresse1Readonly = lejemaal.Adresse1Readonly;
    this.Adresse2Readonly = lejemaal.Adresse2Readonly;
    this.PostNrReadonly = lejemaal.PostNrReadonly;
    this.BygningNrReadonly = lejemaal.BygningNrReadonly;
    this.BoligTypeKodeIdReadonly = lejemaal.BoligTypeKodeIdReadonly;
    this.AntalRumReadonly = lejemaal.AntalRumReadonly;
    this.AntalKamreReadonly = lejemaal.AntalKamreReadonly;
    this.EtageReadonly = lejemaal.EtageReadonly;
    this.PositionReadOnly = lejemaal.PositionReadOnly;
    this.EnableChangeTrackingAndNotifaction =
      lejemaal.EnableChangeTrackingAndNotifaction;
    this.DisplayTekst = lejemaal.DisplayTekst || '';
  }

  getArkivUrlPart(): string {
    return 'api/esdh/lejemaal/' + this.IdReadonly;
  }
}

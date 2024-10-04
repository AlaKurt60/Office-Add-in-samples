export interface LejerStruct {
  $type: string;
  $values: Lejer[];
}

export interface Lejer {
  $values: string;
  $type: string;
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
  DisplayTekst: string;
  id: number;
}

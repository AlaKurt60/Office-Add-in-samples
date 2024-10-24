import { ArkivMappe } from '../Models/arkiv.model';

export interface IModel {
  unikId: number;
  DisplayTekst: string;
  setDisplayTekst(): void;
  getArkivUrlPart(): string;
  getMapper(mapper: ArkivMappe[]): ArkivMappe[];
}

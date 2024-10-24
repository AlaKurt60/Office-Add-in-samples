import { Selskab } from '../Models/selskab.model';

export class SelskabMapper {
  static map(bygning: Selskab[]) {
    var bygningArray: Selskab[] = [];
    var idIndex = 0;
    bygning.forEach((selskab) => {
      bygningArray.push(new Selskab(selskab, idIndex));
      idIndex++;
    });
    return bygningArray;
  }
}

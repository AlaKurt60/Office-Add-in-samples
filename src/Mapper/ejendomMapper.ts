import { Ejendom } from '../Models/ejendom.model';

export class EjendomMapper {
  static map(bygning: Ejendom[]) {
    var ejendomArray: Ejendom[] = [];
    var idIndex = 0;
    bygning.forEach((q) => {
      ejendomArray.push(new Ejendom(q, idIndex));
      idIndex++;
    });
    return ejendomArray;
  }
}

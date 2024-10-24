import { Finansenhed } from '../Models/finansenhed.model';

export class FinansenhedMapper {
  static map(bygning: Finansenhed[]) {
    var enhedArray: Finansenhed[] = [];
    var idIndex = 0;
    bygning.forEach((lm) => {
      enhedArray.push(new Finansenhed(lm, idIndex));
      idIndex++;
    });
    return enhedArray;
  }
}

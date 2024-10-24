import { Kreditor } from '../Models/kreditor.model';

export class KreditorMapper {
  static map(bygning: Kreditor[]) {
    var enhedArray: Kreditor[] = [];
    var idIndex = 0;
    bygning.forEach((lm) => {
      enhedArray.push(new Kreditor(lm, idIndex));
      idIndex++;
    });
    return enhedArray;
  }
}

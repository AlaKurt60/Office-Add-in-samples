import { Lejemaal } from '../Models/lejemaal.model';

export class LejemaalMapper {
  static map(bygning: Lejemaal[]) {
    var bygningArray: Lejemaal[] = [];
    var idIndex = 0;
    bygning.forEach((lm) => {
      bygningArray.push(new Lejemaal(lm, idIndex));
      idIndex++;
    });
    return bygningArray;
  }
}

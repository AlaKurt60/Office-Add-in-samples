import { Bygning } from '../Models/bygning.model';

export class BygningMapper {
  static map(bygning: Bygning[]) {
    var bygningArray: Bygning[] = [];
    var idIndex = 0;
    bygning.forEach((q) => {
      bygningArray.push(new Bygning(q, idIndex));
      idIndex++;
    });
    return bygningArray;
  }
}

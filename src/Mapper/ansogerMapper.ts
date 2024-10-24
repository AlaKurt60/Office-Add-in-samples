import { Ansoger } from '../Models/ansoger.model';

export class AnsogerMapper {
  static map(ansoger: Ansoger[]) {
    var ansogerArray: Ansoger[] = [];
    var idIndex = 0;
    ansoger.forEach((ansog) => {
      ansogerArray.push(new Ansoger(ansog, idIndex));
      idIndex++;
    });
    return ansogerArray;
  }
}

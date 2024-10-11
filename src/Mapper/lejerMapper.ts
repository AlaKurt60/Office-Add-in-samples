import { Lejer } from '../Models/lejer.model';

export class LejerMapper {
  static map(lejer: Lejer[]) {
    var lejerArray: Lejer[] = [];
    var idIndex = 0;
    lejer.forEach((q) => {
      lejerArray.push(new Lejer(q, idIndex));
      idIndex++;
    });
    return lejerArray;
  }
}

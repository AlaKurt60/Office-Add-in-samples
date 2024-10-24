import { StamkortEnum } from '../app/Enums/stamkort.enum';

export class StringUtility {
  static basicUrl = 'http://localhost:54321/';

  static apiUrlmapList = new Map<number, string>()
    .set(StamkortEnum.Lejer, 'api/bolig/lejere')
    .set(StamkortEnum.Bygning, 'api/query/bolig/bygningSoegning')
    .set(StamkortEnum.Lejemål, 'api/query/bolig/lejemaalSoegning')
    .set(StamkortEnum.Finansenhed, 'api/query/finans/finansenheder')
    .set(StamkortEnum.Selskab, 'api/bolig/selskaber/soeg')
    .set(StamkortEnum.Ejendom, 'api/bolig/ejendomme')
    .set(StamkortEnum.Kundeemne, 'api/bolig/kundeemner')
    .set(StamkortEnum.Ansøger, 'api/bolig/ansoegere')
    .set(StamkortEnum.Debitor, 'api/generelt/debitor')
    .set(StamkortEnum.Timesag, 'api/generelt/timesager')
    .set(StamkortEnum.Kreditor, 'api/query/kreditorsoegeresultat');

  static addIfNotNullOrEmpty(tekst?: string) {
    return tekst != null && tekst != '' ? ', ' + tekst : '';
  }

  static addIfNotNull(nr?: number) {
    return nr != null ? ', ' + nr : '';
  }

  static getAbsolutUrl(url: string) {
    return this.basicUrl + url;
  }

  static getApiUrlmap(key: StamkortEnum): string {
    return this.apiUrlmapList.get(key) ?? '';
  }

  static getApiUrl(key: number, soegetekst: string) {
    var maxrecords = 150;
    if (key == StamkortEnum.Ejendom) {
      return this.getAbsolutUrl(
        this.apiUrlmapList.get(key) +
          '?soegeTekst=' +
          soegetekst +
          '&maksAntalResultater=5'
      );
    }
    return this.getAbsolutUrl(
      this.apiUrlmapList.get(key) +
        '?soegeTekst=' +
        soegetekst +
        '&maxrecords=150'
    );
  }
}

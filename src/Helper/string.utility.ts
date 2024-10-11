export class StringUtility {
  static addIfNotNullOrEmpty(tekst?: string) {
    return tekst != null && tekst != '' ? ', ' + tekst : '';
  }

  static addIfNotNull(nr?: number) {
    return nr != null ? ', ' + nr : '';
  }
}

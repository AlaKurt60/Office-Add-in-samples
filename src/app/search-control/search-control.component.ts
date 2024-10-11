import { Component, EventEmitter, Output } from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { SearchService } from './search.service';

import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { Lejer } from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { AutocompleteTypeEnum } from '../Enums/autocompleteType.enum';
import { Bygning } from '../../Models/bygning.model';
import { Finansenhed } from '../../Models/finansenhed.model';

@Component({
  selector: 'app-search-control',
  standalone: true,
  imports: [NgFor, FormsModule, AutocompleteComponent, CommonModule],
  templateUrl: './search-control.component.html',
  styleUrl: './search-control.component.css',
})
export class SearchControlComponent {
  stamkortSelectedValue: string = StamkortEnum[StamkortEnum.Lejer];

  lejerArray: Lejer[] = [];
  stamkortEnumTest = StamkortEnum.Debitor;

  onSubmit(_t8: NgForm) {}

  public StamkortTypesEnum = StamkortEnum;
  public AutocompleteTypeEnum = AutocompleteTypeEnum;
  stamList = Object.keys(this.StamkortTypesEnum).filter((v) =>
    isNaN(Number(v))
  );

  constructor(private searchService: SearchService) {}

  onChangeStamkort(stamkortEvent: Event) {}

  GemMail() {
    // const interfacteTest: Lejer = new Lejer(null);
    // console.log(interfacteTest.getArkivUrl22());
  }
}

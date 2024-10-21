import { Component, EventEmitter, Output } from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { SearchService } from './search.service';

import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { Lejer } from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { AutocompleteTypeEnum } from '../Enums/autocompleteType.enum';
import { NgAutocompleteComponent } from '../NgAutocomplete/ng-autocomplete/ng-autocomplete.component';

@Component({
  selector: 'app-search-control',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    AutocompleteComponent,
    CommonModule,
    NgAutocompleteComponent,
  ],
  templateUrl: './search-control.component.html',
  styleUrl: './search-control.component.css',
})
export class SearchControlComponent {
  stamkortSelectedValue: string = StamkortEnum[StamkortEnum.Lejer];
  selectedOption: any = null;
  lejerArray: Lejer[] = [];
  stamkortEnumTest = StamkortEnum.Debitor;

  onSubmit(searchform: NgForm) {}

  public StamkortTypesEnum = StamkortEnum;
  public AutocompleteTypeEnum = AutocompleteTypeEnum;
  stamList = Object.keys(this.StamkortTypesEnum).filter((v) =>
    isNaN(Number(v))
  );

  constructor(private searchService: SearchService) {}

  onChangeStamkort(stamkortEvent: Event) {}

  optionValueSelected(event: any) {
    console.log('event');
    console.log(event);
    this.selectedOption = event;
  }
  GemMail(searchform: NgForm) {
    console.log('searchform');
    console.log(searchform);
    alert(this.selectedOption.DisplayTekst);
    this.selectedOption = 'new Lejer(null, 10)';
    // const interfacteTest: Lejer = new Lejer(null);
    // console.log(interfacteTest.getArkivUrl22());
  }
}

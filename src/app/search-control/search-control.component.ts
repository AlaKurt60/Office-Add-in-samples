import { Component } from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { SearchService } from './search.service';

import { FormsModule, NgForm } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Lejer } from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { AutocompleteTypeEnum } from '../Enums/autocompleteType.enum';

@Component({
  selector: 'app-search-control',
  standalone: true,
  imports: [NgFor, FormsModule, AutocompleteComponent],
  templateUrl: './search-control.component.html',
  styleUrl: './search-control.component.css',
})
export class SearchControlComponent {
  stamkortSelected: string = 'Lejer';
  lejerArray: Lejer[] = [];
  StamkortEnumTest: any;
  onSubmit(_t8: NgForm) {}
  testOptions: string[] = ['Tal 1', 'Fehh', 'Peter'];

  public StamkortTypesEnum = StamkortEnum;
  public AutocompleteTypeEnum = AutocompleteTypeEnum;

  stamkortList: string[] = [
    'Lejer',
    'Bygning',
    'Lejemål',
    'Finansenhed',
    'Ejendom',
    'Selskab',
    'Ansøger',
    'Kreditor',
    'Debitor',
    'Timesag',
    'Kundeemne',
  ];
  constructor(private searchService: SearchService) {
    this.stamkortList;
  }

  SearchLejer() {
    // this.searchService
    //   .search2('Lejer', 'mads jensen')
    //   // .pipe(
    //   //   map((res: LejerStruct) => {
    //   //     console.log('Map');
    //   //     res.$values.map((a) => a);
    //   //     console.log(res);
    //   //   })
    //   // )
    //   .subscribe({
    //     next: (data: LejerStruct) => {
    //       this.lejerArray = data.$values;
    //       this.SetDisplayTekst();
    //       this.testOptions = ['Tal 1', 'Fehh', 'Peter'];
    //     },
    //     error: (err: Error) => {
    //       console.log('Fejl! ');
    //       console.log(err);
    //     },
    //   });
  }

  SetDisplayTekst() {
    this.lejerArray.forEach((lejer) => {
      lejer.DisplayTekst =
        lejer.LejerstrengReadonly +
        ', ' +
        lejer.NavnReadonly +
        ', ' +
        lejer.Adresse1Readonly +
        ', ' +
        lejer.Adresse2Readonly +
        ', ' +
        lejer.LejerStatusString;
    });
  }
}

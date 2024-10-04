import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatOption,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchService } from '../search-control/search.service';
import { Lejer, LejerStruct } from '../../Models/lejer.model';
import { StamkortEnum } from '../Enums/stamkort.enum';
import { AutocompleteTypeEnum } from '../Enums/autocompleteType.enum';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
})
export class AutocompleteComponent implements OnInit {
  @Input({ required: true }) autocompleteLabel!: string;
  @Input({ required: true }) stamkortType!: StamkortEnum;
  @Input({ required: true }) autocompleteType!: AutocompleteTypeEnum;
  lejerArrayFiltered!: Observable<any[]>;
  // lejerArrayFiltered!: Observable<Lejer[]>;
  lejerArrayFilteredArray: Lejer[] = [];

  searchControl = new FormControl('');
  options: string[] = [];
  filteredOptions?: Observable<string[]>;

  constructor(private searchSercice: SearchService) {}
  streets: string[] = [
    'Champs-Élysées',
    'Lombard Street',
    'Abbey Road',
    'Fifth Avenue',
  ];

  ngOnInit() {
    switch (this.autocompleteType) {
      case AutocompleteTypeEnum.Stamkort: {
        this.lejerArrayFiltered = this.setFilter();
        break;
      }
      case AutocompleteTypeEnum.Noter: {
        this.lejerArrayFiltered = this.setNoteTyper();
        break;
      }
      case AutocompleteTypeEnum.Arkiv: {
        // this.lejerArrayFiltered = this.setFilter();
        break;
      }
    }
  }
  setNoteTyper() {
    return this.searchControl.valueChanges.pipe(
      debounceTime(400),
      filter((x: any) => x.length > 1),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        // switchmap handles cancelling the previous pending request for the new one. ensuring the user doesn't see old data as they typehead
        console.log('searchTerm');
        console.log(searchTerm);
        var response = this.searchSercice.getNoteTyper();
        console.log('Response ', response);
        console.log(response);
        return response;
      })
    );
  }

  setFilter() {
    return this.searchControl.valueChanges.pipe(
      debounceTime(400),
      filter((x: any) => x.length > 1),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        // switchmap handles cancelling the previous pending request for the new one. ensuring the user doesn't see old data as they typehead
        console.log('searchTerm');
        console.log(searchTerm);
        var response = this.searchSercice.searchLejer(
          StamkortEnum.Lejer,
          searchTerm
        );
        console.log('Response ', response);
        console.log(response);
        return response;
      })
    );
  }

  selectedLejer(lejerSelected: Lejer) {
    console.log('Selected');
    console.log(lejerSelected);
  }
}

//Test
// SetDisplayTekst(lejers: Observable<Lejer[]>) {
//   var index = 0;
//   var ar: string[] = [];
//   lejers.subscribe((nnn) => (this.lejertest = this.SetId(nnn)));
//   console.log('this.testArray');
//   console.log(this.testArray);
//   // lejers.forEach((l) => {
//   //   index++;
//   //   if (ar.indexOf(l.KontaktIdReadOnly.toString()) > 0) {
//   //     alert(l.KontaktIdReadOnly.toString());
//   //   }
//   //   ar.push(l.KontaktIdReadOnly.toString());
//   //   l.IdReadonly = index.toString();
//   // });
//   // return of(lejer);
//   return lejers;
// }

// SetId(lejer: Lejer) {}
// SearchLejer(search: string) {
//   this.searchSercice.search2('Lejer', search).subscribe({
//     next: (data: LejerStruct) => {
//       this.lejerArrayFiltered = this.SetDisplayTekst(data.$values);
//       this.lejerArrayFiltered = this.searchControl.valueChanges.pipe(
//         startWith(''),
//         debounceTime(400),
//         map((value) => this._filter(value || ''))
//       );
//     },
//   });
// }

// SearchLejer(search: string) {
//   this.searchSercice.search2('Lejer', search).subscribe({
//     next: (data: LejerStruct) => {
//       this.lejerArray = data.$values;
//       this.SetDisplayTekst();
//       var opt: string[] = [];
//       this.lejerArray.forEach((lejer) => {
//         opt.push(lejer.DisplayTekst);
//       });
//       this.options = opt;
//       this.filteredOptions = this.searchControl.valueChanges.pipe(
//         startWith(''),
//         map((value) => this._filter(value || ''))
//       );
//     },
//     error: (err: Error) => {
//       console.log('Fejl! ');
//       console.log(err);
//     },
//   });
// }

// SetDisplayTekst() {
//   this.lejerArray.forEach((lejer) => {
//     lejer.DisplayTekst =
//       lejer.LejerstrengReadonly +
//       ', ' +
//       lejer.NavnReadonly +
//       ', ' +
//       lejer.Adresse1Readonly +
//       ', ' +
//       lejer.Adresse2Readonly +
//       ', ' +
//       lejer.LejerStatusString;
//   });
// }
// ngOnInitOld() {
// this.filteredOptions = this.searchControl.valueChanges.pipe(
//   startWith(''),
//   map((value) => this._filter(value || ''))
// );
// this.searchSercice.search2('Lejer', 'j').subscribe((data) => {
//   console.log(data);
//   this.filteredOptions = data;
// });
// }

// private _filterOld(value: string): Observable<Lejer[]> | undefined {
//   if (value != '') {
//     this.SearchLejer(value);
//   }
//   const filterValue = value.toLowerCase();
//   return this.lejerArrayFiltered;
//   // this.options.filter((option) =>
//   //   option.toLowerCase().includes(filterValue)
//   // );
// }

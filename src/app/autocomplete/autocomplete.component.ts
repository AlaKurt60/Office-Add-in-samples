import {
  afterNextRender,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
  output,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  NgModel,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  subscribeOn,
  Subscription,
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
import { Note } from '../../Models/notetype.model';
import { ArkivService } from '../../Services/arkiv.service';
import { Bygning } from '../../Models/bygning.model';

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
  mouseOver(event: MouseEvent) {
    // alert(event);
  }
  private searchForm = viewChild.required<NgForm>('autocompleteForm');

  @Input({ required: true }) autocompleteLabel!: string;
  @Input() stamkortTypeValue!: string;
  @Input({ required: true }) autocompleteType!: AutocompleteTypeEnum;

  @Input() set selectedOptionInput(value: any) {
    console.log('Stamkort value ', value);
    this.searchControl.setValue(null); // = 'Test'
    // this.selectedOption = null;
  }
  // @Input() selectedOptionInput?: any; // = (a: any) => DoSome(a);

  @Output() optionLejerSelected = new EventEmitter();

  arkivService = inject(ArkivService);

  select = output<string>();
  onselect = input<string>();

  optionArrayFiltered!: Observable<any[]>;
  noteArray!: Note[];

  searchControl = new FormControl('');
  selectedOption: any;

  destroyRef = inject(DestroyRef);

  constructor(
    private searchSercice: SearchService // private arkivService: ArkivService
  ) {
    afterNextRender(() => {
      const subscription = this.searchForm().valueChanges?.subscribe({
        next: (value) => console.log('ny value', value.autocompleteValue),
      });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // var lej = this.selectedOptionInput as Lejer;
    // alert(this.selectedOptionInput?.DisplayTekst);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }
  ngOnInit() {
    switch (this.autocompleteType) {
      case AutocompleteTypeEnum.Stamkort: {
        this.initFilterOptions();
        break;
      }
      case AutocompleteTypeEnum.Noter: {
        this.initNoteAutocomplete();
        break;
      }
      case AutocompleteTypeEnum.Arkiv: {
        this.initArkivAutocomplete();
        break;
      }
    }
  }
  stamList: string[] = Object.keys(StamkortEnum).filter((v) =>
    isNaN(Number(v))
  );

  private getAsNumber(stamkortTypeValue: string): number {
    for (var n in this.stamList) {
      if (this.stamList[n] == stamkortTypeValue) {
        return +n;
      }
    }
    return -1;
  }
  onFocus() {
    if (this.autocompleteType == AutocompleteTypeEnum.Arkiv) {
      this.searchControl.updateValueAndValidity();
    }
  }

  initFilterOptions() {
    this.optionArrayFiltered = this.searchControl.valueChanges.pipe(
      debounceTime(400),
      filter((x: any) => x.length > 0), //Måske 1 eller 2
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        // switchmap handles cancelling the previous pending request for the new one. ensuring the user doesn't see old data as they type
        var asNumber = this.getAsNumber(this.stamkortTypeValue);
        var response = this.searchSercice.searchOptions(asNumber, searchTerm);
        return response;
      })
    );
  }

  private initArkivAutocomplete() {
    this.optionArrayFiltered = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterArkiv(value || ''))
    );
  }

  private initNoteAutocomplete() {
    this.searchSercice.getNoteTyper().subscribe({
      next: (data: Note[]) => {
        this.noteArray = data;
        this.optionArrayFiltered = this.searchControl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterNotes(value || ''))
        );
      },
      error: (errorres) => console.log('Error ', errorres),
    });
  }

  private filterArkiv(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.arkivService.arkivMapper.filter(
      (op) =>
        op.DisplayTekst != '' &&
        op.DisplayTekst.toLowerCase().includes(filterValue)
    );
  }

  private filterNotes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.noteArray.filter(
      (op) =>
        op.DisplayTekst != '' &&
        op.DisplayTekst.toLowerCase().includes(filterValue)
    );
  }

  onSelectOption(optionSelected: any) {
    console.log(optionSelected);
    if (optionSelected instanceof Lejer) {
      var url = (optionSelected as Lejer).getArkivUrlPart();
      this.arkivService.getArkivMapper(url).subscribe({
        next: (data) => {
          console.log(data);
          this.searchControl.updateValueAndValidity();
          console.log('this.selectedOption?.DisplayTekst');
          console.log(this.selectedOption?.DisplayTekst);
          this.optionLejerSelected.emit(optionSelected);
        },
        error: (er) => console.log(er),
      });
    }
    if (optionSelected instanceof Bygning) {
      var url = (optionSelected as Bygning).getArkivUrlPart();
      this.arkivService.getArkivMapper(url).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (er) => console.log(er),
      });
    }
    console.log('this.searchForm() value');
    console.log(this.searchForm().controls['autocompleteValue'].getRawValue());
  }
}

function DoSome(a: any) {
  alert(a);
  console.log('DoSomething');
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

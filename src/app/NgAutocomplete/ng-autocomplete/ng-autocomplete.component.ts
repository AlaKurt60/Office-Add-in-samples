import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  NgModel,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { AutocompleteTypeEnum } from '../../Enums/autocompleteType.enum';
import { ArkivService } from '../../../Services/arkiv.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { Note } from '../../../Models/notetype.model';
import { SearchService } from '../../search-control/search.service';
import { Bygning } from '../../../Models/bygning.model';
import { Lejer } from '../../../Models/lejer.model';
import { StamkortEnum } from '../../Enums/stamkort.enum';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.name != null && control.value.name.includes('or')) {
    return null;
  }
  return { indeholderIkkeSporgsmaalsTegn: true };
}

@Component({
  selector: 'app-ng-autocomplete',
  standalone: true,
  imports: [AutocompleteLibModule, ReactiveFormsModule],
  templateUrl: './ng-autocomplete.component.html',
  styleUrl: './ng-autocomplete.component.css',
})
export class NgAutocompleteComponent implements OnInit {
  @Input({ required: true }) autocompleteLabel!: string;
  @Input() stamkortTypeValue!: string;
  @Input({ required: true }) autocompleteType!: AutocompleteTypeEnum;

  @Input() set selectedOptionInput(value: any) {
    console.log('Stamkort value ', value);
    this.ngformReactiv.controls.ngAutocompleteInput.setValue(null);
  }

  @Output() optionLejerSelected = new EventEmitter();
  ngformReactiv = new FormGroup({
    ngAutocompleteInput: new FormControl('', {
      validators: [Validators.required, mustContainQuestionMark],
    }),
  });
  select = output<string>();
  onselect = input<string>();

  optionArrayFiltered!: Observable<any[]>;
  optionArray!: Lejer[];
  noteArray!: Note[];

  searchControl = new FormControl('');
  selectedOption: any;

  destroyRef = inject(DestroyRef);

  constructor(
    private searchSercice: SearchService,
    private arkivService: ArkivService
  ) {}

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

  initFilterOptions() {
    this.ngformReactiv.controls.ngAutocompleteInput.valueChanges
      .pipe(
        debounceTime(400),
        filter((x: any) => x.length > 0), //Måske 1 eller 2
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          // switchmap handles cancelling the previous pending request for the new one. ensuring the user doesn't see old data as they type
          var asNumber = this.getAsNumber(this.stamkortTypeValue);
          var response = this.searchSercice.searchOptions(asNumber, searchTerm);
          this.optionArrayFiltered = response;
          return response;
        })
      )
      .subscribe((a) => {
        console.log('Ressss');
        console.log(a);

        this.optionArray = a;
      });
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
  onSelectOption(optionSelected: any) {
    // alert(9);
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
    setTimeout(() => {
      console.log('this.searchForm() value');
      console.log(this.ngformReactiv.controls.ngAutocompleteInput);
    }, 1001);
  }

  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Georgia',
    },
    {
      id: 2,
      name: 'Usa',
    },
    {
      id: 3,
      name: 'England',
    },
  ];

  get autocompleteIsInvalid() {
    const field = this.ngformReactiv.controls.ngAutocompleteInput;
    return field.touched && field.invalid && field.dirty;
  }

  selectEvent(item: any) {
    console.log(this.ngformReactiv.controls.ngAutocompleteInput);
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }
}

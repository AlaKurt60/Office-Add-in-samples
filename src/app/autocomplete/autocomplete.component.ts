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
  FormGroup,
  Validators,
  AbstractControl,
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

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { indeholderIkkeSporgsmaalsTegn: true };
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    // FormsModule,
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

  formReactiv = new FormGroup({
    autocompleteInput: new FormControl('', {
      validators: [Validators.required, mustContainQuestionMark],
    }),
    autocompleteOption: new FormControl('', {
      validators: [Validators.required, mustContainQuestionMark],
    }),
  });

  get autocompleteIsInvalid() {
    const field = this.formReactiv.controls.autocompleteInput;
    return field.touched && field.invalid;
  }

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
        console.log('Lejer response ', response);
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
    if (this.autocompleteType == AutocompleteTypeEnum.Stamkort) {
      console.log('optionSelected');
      console.log(optionSelected);
      this.arkivService.getArkivMapper(optionSelected).subscribe({
        next: (data) => {
          console.log(data);
          this.searchControl.updateValueAndValidity();
          this.optionLejerSelected.emit(optionSelected);
        },
        error: (er) => console.log(er),
      });
      setTimeout(() => {
        console.log('this.searchForm() value');
        console.log(this.formReactiv.controls.autocompleteInput);
      }, 110);
    }
  }
}

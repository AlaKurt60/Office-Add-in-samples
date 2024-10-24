import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteTypeEnum } from '../../Enums/autocompleteType.enum';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatOption,
} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ng-autocomplete',
  standalone: true,
  imports: [ReactiveFormsModule, MatAutocompleteModule, AsyncPipe, NgFor],
  templateUrl: './ng-autocomplete.component.html',
  styleUrl: './ng-autocomplete.component.css',
})
export class NgAutocompleteComponent implements OnInit {
  // Define the form group
  formReactiv = new FormGroup({
    myControl: new FormControl('', {
      validators: [Validators.required], // Add any validators here
    }),
  });
  @Input({ required: true }) autocompleteLabel!: string;
  @Input() stamkortTypeValue!: string;
  @Input({ required: true }) autocompleteType!: AutocompleteTypeEnum;

  // @Input() set selectedOptionInput(value: any) {
  //   console.log('Stamkort value ', value);
  //   this.ngformReactiv.controls.ngAutocompleteInput.setValue(null);
  // }

  @Output() optionLejerSelected = new EventEmitter();
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    // Access the form control using the form group and apply filtering logic
    this.filteredOptions = this.formReactiv.get('myControl')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}

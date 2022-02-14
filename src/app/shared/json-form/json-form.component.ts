import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";

@Component({
  selector: 'app-json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class JsonFormComponent implements OnInit {

  form = new FormGroup({});

  @Input()
  fields!: FormlyFieldConfig[];

  @Input()
  defaultModel: any = {};

  @Input()
  formLayout:'horizontal' | 'vertical' | 'inline'= 'inline';

  @Output()
  modelChange= new EventEmitter<any>();

  @Output()
  submit = new EventEmitter<FormGroup>();

  constructor() { }

  ngOnInit(): void {
  }

  onModelChange(event:any){
    this.modelChange.emit(event);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submit.emit(this.form);
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  get value(){
    return this.form.value;
  }

}

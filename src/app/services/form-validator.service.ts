import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {

  constructor() { }

  validateForm(form: FormGroup | FormArray): boolean {
    if (form.invalid){
      let errorFields = [];
      for (const i in form.controls) {
        if (form.controls[i] instanceof FormArray || form.controls[i] instanceof FormGroup) {
          let validation = this.validateForm(form.controls[i])
        }
        form.controls[i].markAsDirty();
        form.controls[i].updateValueAndValidity();
      }
      return false
    } else {
      return true
    }
  }
}

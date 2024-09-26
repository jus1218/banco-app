import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MessageManagerService {

  constructor() { }


  getFieldError(field: string, myForm: FormGroup): string | null {

    if (!myForm.controls[field]) return null;

    const type = myForm.controls[field];

    const errors = myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'min':
          return 'Seleccione una opcion o ingrese la opción';
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracters.`;
        case 'maxlength':
          return `Maximo ${errors['maxlength'].requiredLength} caracters.`;
      }

    }

    return null;
  }
}

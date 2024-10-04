import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageManagerService {

  constructor() { }


  getFieldOfGroupError(field: string, myForm: FormGroup): string | null {

    if (!myForm.controls[field]) return null;
    const errors = myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'pattern':
          return 'Ingrese solo numeros y el pimer numero debe ser mayor a 0';
        case 'min':
          return 'Seleccione una opcion o ingrese la opción';
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Maximo ${errors['maxlength'].requiredLength} caracteres.`;
      }

    }

    return null;
  }
  getFieldOfControlError(myForm: FormControl): string | null {

    if (!myForm.errors) return null;



    const errors = myForm.errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'pattern':
          return 'Ingrese solo numeros';
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

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  showMessage(messageRef: { message: Message | null }) {
    setTimeout(() => {
      messageRef.message = {
        message: "ds", isSuccess: false
      };
    }, 4000);
  }

}

import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Message } from '../interfaces/message.interface';
import Swal from 'sweetalert2';
import { buildMessage, MessageSweetAlert, TITLE_M } from '../interfaces/message-sweet-alert.interface';
@Injectable({
  providedIn: 'root'
})
export class MessageManagerService {

  // private confirmSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }


  getFieldOfGroupError(field: string, myForm: FormGroup): string | null {

    // const msg = '/^[0-9]+$/' === errors['pattern'].requiredPattern ? 'Ingrese solo numeros' : '';
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
        message: "ds", success: false
      };
    }, 4000);
  }


  confirmBox(
    messages: MessageSweetAlert): Observable<boolean> {

    const { title, message, icon, confirmButtonText, cancelButtonText } = buildMessage(messages);
    // Creamos un nuevo Subject en cada llamado para evitar duplicados
    const confirmSubject = new Subject<boolean>();
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    }).then((result) => {
      if (result.value) {
        confirmSubject.next(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        confirmSubject.next(false);
      }

      confirmSubject.complete();
    });

    return confirmSubject.asObservable();
  }


  simpleBox({ title, message, success: isSuccess }: Message): void {
    Swal.fire(
      title,
      message,
      isSuccess ? 'success' : 'error'
    )
  }

}

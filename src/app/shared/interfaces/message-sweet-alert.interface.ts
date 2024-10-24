export interface MessageSweetAlert { title?: string, message?: string, confirmButtonText?: string, cancelButtonText?: string, icon?: IconAlert }

type IconAlert = 'success' | 'error' | 'warning' | 'info';

export const TITLE_M: string = 'Quieres eliminar el registro?';
export const MESSAGE_M: string = 'no podras recuperarlo nuevamente!';
export const CONFIRME_BUTTON_TEXT_M: string = 'Si';
export const CANCEL_BUTTON_TEXT_M: string = 'No';
export const ICON_M: IconAlert = 'warning';



export function buildMessage(options: MessageSweetAlert): MessageSweetAlert {
  return {
    title: options.title || TITLE_M,
    message: options.message || MESSAGE_M,
    confirmButtonText: options.confirmButtonText || CONFIRME_BUTTON_TEXT_M,
    cancelButtonText: options.cancelButtonText || CANCEL_BUTTON_TEXT_M,
    icon: options.icon || ICON_M
  };
}

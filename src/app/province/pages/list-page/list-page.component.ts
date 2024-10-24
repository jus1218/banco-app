import { Component, OnInit } from '@angular/core';
import { UbicationService } from '../../../shared/service/ubication.service';
import { ProvinciaDetail } from '../../../shared/interfaces/provincia-detail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinciaPaginationFilter } from '../../../shared/interfaces/provincie-pagination-filter.interface';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
import { CommonResponse } from '../../../clients/interface/client.interface';
import { DEFAULT_OFFSET, DEFAULT_LIMIT as DEFAULT_LIMIT, LIMITS } from '../../../shared/constants/constants';
import { ValidatorsService } from '../../../shared/service/validator.service';
import { Message } from '../../../shared/interfaces/message.interface';

const OFFSET: string = 'offset';
const LIMIT: string = 'limit';
const LIMITES: string = 'limites';
const NOMBRE: string = 'nombre';
const EMPTY: string = '';


@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit {

  // Variables visuales
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;
  // // Arreglos
  public provincias: ProvinciaDetail[] = [];
  // // Formulario
  public paginationForm!: FormGroup;

  constructor(
    private provinciaService: UbicationService,
    private fb: FormBuilder,
    private messageManagerService: MessageManagerService,
    private validatorsService: ValidatorsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProvincies();
    this.onChangeLimit();

  }
  initForm(): void {
    this.paginationForm = this.fb.group(
      {
        offset: [DEFAULT_OFFSET, this.validatorsService.offsetIsValid],
        limit: [DEFAULT_LIMIT, this.validatorsService.offsetIsLimit],
        nombre: [EMPTY, [Validators.required,]],
        limites: [LIMITS, []]
      }
    );
  }

  loadProvincies(): void {
    this.isLoading = true;

    const { offset, limit, nombre } = this.currentPagination;
    this.provinciaService.getProvincies({ offset: offset * limit, limit, nombre })
      .subscribe((res) => this.handleResponse(res));

  }


  onIncrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset + 1);
    this.loadProvincies();
  }
  onDecrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset - 1);
    this.loadProvincies();
  }
  onSearch(event: any): void {
    event.preventDefault();
    this.loadProvincies();
  }

  onChangeLimit(): void {

    this.paginationForm.get(LIMIT)?.valueChanges
      .subscribe(() => {
        this.paginationForm.get(OFFSET)?.setValue(DEFAULT_OFFSET)
        this.loadProvincies();
      })

  }

  get limites(): number[] {
    return [...this.paginationForm.get(LIMITES)?.value]
  }
  get currentPagination(): ProvinciaPaginationFilter {
    const form = this.paginationForm;
    return {
      offset: Number(form.get(OFFSET)?.value),
      limit: Number(form.get(LIMIT)?.value),
      nombre: form.get(NOMBRE)?.value
    }
  }

  handleResponse({ success: isSuccess, message, value }: CommonResponse<ProvinciaDetail[]>): void {
    this.isLoading = false;
    if (!isSuccess) {
      this.messageManagerService.simpleBox({ message, success: isSuccess })
      return;
    }
    this.canPagination = value!.length === this.currentPagination.limit;
    this.provincias = value!
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BanksService } from '../../services/banks.service';
import { Bank } from '../../interfaces/bank.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from '../../../shared/service/pagination.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Message } from '../../../shared/interfaces/message.interface';
import { RouterService } from '../../../shared/service/router.service';
import { Ruta } from '../../../shared/interfaces/ultima-ruta.interface';
import { MessageManagerService } from '../../../shared/service/message-manager.service';
const OFFSET: string = 'offset';
const LIMIT: string = 'limit';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public banks: Bank[] = [];
  public paginationForm!: FormGroup;
  public isLoading: boolean = false;
  public canPagination: boolean = false;
  public message: Message | null = null;

  constructor(
    private router: Router,
    private banksService: BanksService,
    private fb: FormBuilder,
    private routerService: RouterService,
    private sms: MessageManagerService
  ) {
    this.initValuesForm();
  }

  ngOnInit(): void {
    this.loadBanks();

  }

  initValuesForm(): void {
    this.paginationForm = this.fb.group({
      offset: [0, [Validators.required, Validators.min(0)]],
      limit: [5, [Validators.required, Validators.min(1)]],
      nombre: ['', [Validators.minLength(1)]],
    })

  }

  get currentPagination() {
    const form = this.paginationForm;
    return {
      offset: Number(form.get(OFFSET)?.value),
      limit: Number(form.get(LIMIT)?.value),
      nombre: form.get('nombre')?.value
    }
  }


  loadBanks(): void {
    this.isLoading = true;

    const { offset, limit, nombre } = this.currentPagination;
    this.banksService.getBancos(offset * limit, limit, nombre).subscribe(({ message, success: isSuccess, value: banks }) => {
      if (!isSuccess) {
        this.sms.simpleBox({ message, success: isSuccess });
        this.isLoading = false;
        return;
      }
      this.banks = banks!;
      this.canPagination = banks!.length === limit;
      this.isLoading = false;
    });
  }



  onIncrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset + 1);
    this.loadBanks();
  }
  onDecrease(): void {
    this.paginationForm.get(OFFSET)?.setValue(this.currentPagination.offset - 1);
    this.loadBanks();
  }
  onSearch(event: any): void {
    event.preventDefault();
    this.loadBanks();
  }




}

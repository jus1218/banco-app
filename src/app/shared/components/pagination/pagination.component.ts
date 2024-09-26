import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() public canPagination!: Boolean;
  @Input() public currentOffset: number = 0;



  @Output() public onDecreaseOffset: EventEmitter<number> = new EventEmitter();
  @Output() public onIncreaseOffset: EventEmitter<number> = new EventEmitter();


  decrease(): void {

    this.onDecreaseOffset.emit(--this.currentOffset);

  }
  increase(): void {
    this.onIncreaseOffset.emit(++this.currentOffset);

  }

}

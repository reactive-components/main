import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from './todo';

@NgModule({
  imports: [CommonModule],
  providers: [TodoStore]
})
export class StoreModule {}

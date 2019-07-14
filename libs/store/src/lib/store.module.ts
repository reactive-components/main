import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from './todo';
import { MainStore } from './main.store';

@NgModule({
  imports: [CommonModule],
  providers: [MainStore, TodoStore]
})
export class StoreModule {}

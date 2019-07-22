import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StoreModule, TodoStore } from '@reactive-components/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyTodoFactory } from '@reactive-components/todo';
import { MyLogFactory } from '@reactive-components/log';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    StoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private todoStore: TodoStore) {
    MyTodoFactory(todoStore)
    MyLogFactory(todoStore);
  }
}

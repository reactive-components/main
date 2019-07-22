import { of, Subject } from 'rxjs';
import { Action, Store, reducer, Reducer } from '@reactive-redux/store';
import { TransducerFn } from '@reactive-redux/store/dist/interfaces';

export class BaseStore<State, Actions extends Action = any> extends Store<
  State,
  Actions
> {
  constructor(
    public baseConfig: {
      initialState: State;
      reducer: Reducer<State>;
      transducers: TransducerFn<State, any>[];
      actionSubject: Subject<any>;
      destroySubject: Subject<any>;
    }) {
    super({
      actionStream$: baseConfig.actionSubject.asObservable(),
      destroy$: baseConfig.destroySubject.asObservable(),
      initialState$: of(baseConfig.initialState),
      reducer$: of(baseConfig.reducer),
      transducers$: of(baseConfig.transducers || [])
    });
  }

  dispatch(action: Actions) {
    this.baseConfig.actionSubject.next(action);
  }

  destroy() {
    this.baseConfig.destroySubject.next(true);
  }
}

import { of, Subject } from 'rxjs';
import { Action, Store, reducer, Reducer } from '@reactive-redux/store';
import { TransducerFn } from '@reactive-redux/store/dist/interfaces';

export class BaseStore<State, Actions extends Action = any> extends Store<
  State,
  Actions
> {
  static readonly actionSubject = new Subject<any>();
  static readonly destroySubject = new Subject<boolean>();

  constructor(
    public baseConfig: {
      initialState?: State;
      reducer?: Reducer<State>;
      transducers?: TransducerFn<State, any>[];
    } = {
      initialState: {} as State,
      reducer: reducer<State>({} as any),
      transducers: []
    }
  ) {
    super({
      actionStream$: BaseStore.actionSubject.asObservable(),
      destroy$: BaseStore.destroySubject.asObservable(),
      initialState$: of(baseConfig.initialState),
      reducer$: of(baseConfig.reducer),
      transducers$: of(baseConfig.transducers || [])
    });
  }

  dispatch(action) {
    BaseStore.actionSubject.next(action);
  }

  destroy() {
    BaseStore.destroySubject.next(true);
  }
}

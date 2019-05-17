import { of, Subject } from 'rxjs';
import { Action, Store } from '@reactive-redux/store';

export class BaseStore<State, ActionsUnion extends Action> extends Store<State, ActionsUnion> {
  static readonly actionSubject = new Subject<any>();
  static readonly destroySubject = new Subject();

  constructor(public baseConfig: {
    initialState,
    reducers,
    transducers
  }) {
    super({
      actionStream$: BaseStore.actionSubject.asObservable(),
      destroy$: BaseStore.destroySubject.asObservable(),
      initialState$: of(baseConfig.initialState),
      reducers$: of(baseConfig.reducers),
      transducers$: of(baseConfig.transducers)
    } as any);
  }

  dispatch(action: ActionsUnion) {
    BaseStore.actionSubject.next(action);
  }

  destroy() {
    BaseStore.destroySubject.next(true);
  }
}

import { produce } from 'immer';
import { reduceNS } from '@reactive-redux/store';
import { ActionsUnion } from './actions';
import { TodoState } from './store';

export const history = reduceNS<TodoState, ActionsUnion>((state, action) =>
  produce(state, draft => {
    const timestamp = new Date().getTime();

    draft.log[timestamp] = {
      action,
      timestamp,
      visible: true
    };
  })
);

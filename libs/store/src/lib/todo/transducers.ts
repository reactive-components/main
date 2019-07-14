import { produce } from 'immer';
import { reduceNS } from '@reactive-redux/store';
import { TodoState } from './interfaces';

export const history = reduceNS<TodoState, any>((state, action) =>
  produce(state, draft => {
    const timestamp = new Date().getTime();

    draft.log[timestamp] = {
      action,
      timestamp,
      visible: true
    };
  })
);

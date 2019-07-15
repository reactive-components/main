import { produce } from 'immer';
import { reduceNS, isType } from '@reactive-redux/store';
import { TodoState } from './interfaces';
import { hideLogItem } from './actions';

export const history = reduceNS<TodoState, any>((state, action) =>
  produce(state, draft => {
    if (isType(action, hideLogItem)) return;

    const timestamp = new Date().getTime();

    draft.log[timestamp] = {
      action,
      timestamp,
      visible: true
    };
  })
);

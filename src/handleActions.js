import invariant from 'invariant';
import { observableDiff, applyChange } from 'deep-diff';

function identify(value) {
  return value;
}

function handleAction(actionType, reducer = identify) {
  return (state, action) => {
    const { type } = action;
    invariant(type, 'dispatch: action should be a plain Object with type');
    if (actionType === type) {
      const newState = reducer(state, action);
      if (type.indexOf('@@') === -1) {
        try {
          const types = type.split('/', 2);
          const diff = {};
          observableDiff(state, newState, function(d) {
            if (d.path && d.path.length > 0) {
              diff[d.path[0]] = newState[d.path[0]]
            }
          })
          global._event_.emit(types[0], types[0], diff);
        } catch (error) {
          console.log(error);
        }
      }
      return newState;
    }

    return state;
  };
}

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce((p, r) => r(p, current), previous);
}

function handleActions(handlers, defaultState) {
  const reducers = Object.keys(handlers).map(type =>
    handleAction(type, handlers[type])
  );
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}

export const _handleActions = handleActions;
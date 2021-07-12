import { Action, ActionKind, State } from './usePony.interface';

export const initialState: State = {
  activeSlideIndex: 0,
  slideDirection: ActionKind.Reset,
};

export const reducer = (prevState: State, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionKind.Reset:
      return initialState;
    case ActionKind.Previous:
      const isFirstIndex = prevState.activeSlideIndex === 0;
      return {
        ...prevState,
        slideDirection: ActionKind.Previous,
        activeSlideIndex: isFirstIndex
          ? payload?.numItems - 1
          : prevState.activeSlideIndex - 1,
      };
    case ActionKind.Next:
      const isLastIndex = prevState.activeSlideIndex === payload.numItems - 1;
      return {
        ...prevState,
        slideDirection: ActionKind.Next,
        activeSlideIndex: isLastIndex ? 0 : prevState.activeSlideIndex + 1,
      };
    default:
      return prevState;
  }
};

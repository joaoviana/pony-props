import type { MutableRefObject } from 'react';

export enum ActionKind {
  Next = 'Next',
  Previous = 'Previous',
  Reset = 'Reset',
}

export type State = {
  activeSlideIndex: number;
  slideDirection: ActionKind;
};

export type Action = {
  type: ActionKind;
  payload: {
    numItems: number;
  };
};

import {
  CSSProperties,
  useCallback,
  useReducer,
  useState,
  AriaAttributes,
  useEffect,
  useRef,
} from 'react';
import { Action, ActionKind, State } from './usePony.interface';

const initialState: State = {
  activeSlideIndex: 0,
  slideDirection: ActionKind.Reset,
};

/**
 * Gets the flex order for a slide.
 * @param index - the index of the slide
 * @param activeSlideIndex - the current/visible slide index
 * @param numItems - number of slides in carousel
 * @returns the flex order for a carousel item
 */
const getOrder = ({
  index,
  activeSlideIndex,
  numItems,
}: Record<'index' | 'activeSlideIndex' | 'numItems', number>) =>
  index - activeSlideIndex < 0
    ? numItems - Math.abs(index - activeSlideIndex)
    : index - activeSlideIndex;

const reducer = (prevState: State, action: Action) => {
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

// TODO: readme
// TODO: throw error if not all props are applied, warning the dev that the component might no be 100% accessible

export const usePony = ({ numItems }: { numItems: number }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sliderRef = useRef<HTMLUListElement>(null);
  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<
    ActionKind.Previous | ActionKind.Next | null
  >(null);

  useEffect(() => {
    // Listen for swipe direction changes. Apply appropriate translateX transition.
    if (currentSwipeDirection) {
      const transformArray = [
        { transform: 'translateX(-100%)' },
        { transform: 'translateX(0px)' },
      ];

      sliderRef?.current?.animate(
        currentSwipeDirection === ActionKind.Previous
          ? transformArray
          : transformArray.reverse(),
        {
          easing: 'ease-in',
          duration: 200, // TODO: make this a constant
        }
      );

      // Automatically focus on new active carousel slide for a11y reasons.
      setTimeout(() => {
        document.getElementById('arousel-item-active')?.focus();
      }, 200);
    }
  }, [state.activeSlideIndex, currentSwipeDirection, numItems]);

  const slide = (slideDirection: ActionKind.Previous | ActionKind.Next) => {
    setCurrentSwipeDirection(slideDirection);
    dispatch({ type: slideDirection, payload: { numItems } });
  };

  const getSectionProps = useCallback(
    () => ({
      as: 'section',
      'aria-labelledby': 'carouselheading',
      'aria-roledescription': 'carousel',
    }),
    []
  );

  const getSectionHeadingProps = () => ({
    id: 'carouselheading',
  });

  const getCarouselProps = () => ({
    'aria-label': 'Slides',
    ref: sliderRef,
    style: {
      display: 'flex',
    },
  });

  const getCarouselItemProps = (index: number) => ({
    id: `carousel-item-${index}${
      index === state.activeSlideIndex ? '-active' : ''
    }`,
    'aria-roledescription': 'slide',
    'aria-label': `${index} of ${numItems}`,
    'aria-current': index === state.activeSlideIndex,
    'aria-hidden': index !== state.activeSlideIndex,
    style: {
      order: getOrder({
        index,
        activeSlideIndex: state.activeSlideIndex,
        numItems,
      }),
      display: 'flex',
      flex: '1 0 100%',
      flexBasis: '100%',
      transition:
        // Only apply this transition when the current swipe direction is next
        // This ensures the re-ordering of items is smoother.
        currentSwipeDirection === ActionKind.Next
          ? 'order 0.3s ease-in'
          : 'none',
    },
  });

  const getCarouselButtonProps = (
    direction: ActionKind.Previous | ActionKind.Next
  ) => ({
    'aria-label': direction === ActionKind.Previous ? 'Previous' : 'Next',
    onClick: () => slide(direction),
  });

  const getCarouselAnnouncerProps = () => ({
    'aria-live': 'polite' as AriaAttributes['aria-live'],
    'aria-atomic': 'true' as AriaAttributes['aria-atomic'],
    style: {
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: '1px',
      overflow: 'hidden',
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: '1px',
    } as CSSProperties,
  });

  // returns

  return {
    // prop getters.
    getSectionProps,
    getSectionHeadingProps,
    getCarouselProps,
    getCarouselItemProps,
    getCarouselButtonProps,
    getCarouselAnnouncerProps,
    // actions.
    // state.
    state: {
      ...state,
      currentSwipeDirection,
    },
  };
};

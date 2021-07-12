import {
  CSSProperties,
  useReducer,
  useState,
  AriaAttributes,
  useEffect,
  useRef,
} from 'react';
import { ActionKind } from './usePony.interface';
import { initialState, reducer } from './usePony.state';
import { getOrder } from './utils/get-flex-order';

const TRANSITION_DURATION_MS = 200;

// TODO: readme
// TODO: throw error if not all props are applied, warning the dev that the component might no be 100% accessible

export const usePony = ({ numItems }: { numItems: number }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLUListElement>(null);
  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<
    ActionKind.Previous | ActionKind.Next | null
  >(null);

  useEffect(() => {
    if (carouselRef.current) {
      Array.from(carouselRef.current?.children).forEach((child) => {
        console.log(child);
      });
    }
  }, [carouselRef]);

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
          duration: TRANSITION_DURATION_MS,
        }
      );

      // Automatically focus on new active carousel slide for a11y reasons.
      setTimeout(() => {
        document.getElementById('arousel-item-active')?.focus();
      }, TRANSITION_DURATION_MS);
    }
  }, [state.activeSlideIndex, currentSwipeDirection, numItems]);

  const slide = (slideDirection: ActionKind.Previous | ActionKind.Next) => {
    setCurrentSwipeDirection(slideDirection);
    dispatch({ type: slideDirection, payload: { numItems } });
  };

  const getSectionProps = () => ({
    as: 'section',
    'aria-labelledby': 'carouselheading',
    'aria-roledescription': 'carousel',
    ref: carouselRef,
  });

  const getSectionHeadingProps = () => ({
    id: 'carouselheading',
  });

  const getCarouselWrapperProps = () => ({
    style: { width: '100%', overflow: 'hidden' },
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

  return {
    // prop getters.
    getSectionProps,
    getSectionHeadingProps,
    getCarouselWrapperProps,
    getCarouselProps,
    getCarouselItemProps,
    getCarouselButtonProps,
    getCarouselAnnouncerProps,
    // state.
    state: {
      ...state,
      currentSwipeDirection,
    },
  };
};

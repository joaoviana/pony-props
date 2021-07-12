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

export const usePony = ({ numItems }: { numItems: number }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLUListElement>(null);
  const carouselItemRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<
    ActionKind.Previous | ActionKind.Next | null
  >(null);

  useEffect(() => {
    if (!sectionRef.current) {
      throw new Error('please apply getSectionProps() to your <section>');
    }
    if (!headingRef.current) {
      throw new Error('please apply getHeadingProps() to your <h{1,2,3}>');
    }
    if (!carouselWrapperRef.current) {
      throw new Error('please apply getCarouselWrapperProps() to your <div>');
    }
    if (!carouselRef.current) {
      throw new Error('please apply getCarouselProps() to your <ul>');
    }
    if (!carouselItemRef.current) {
      throw new Error('please apply getCarouselItemProps() to your <li>');
    }
    if (!buttonRef.current) {
      throw new Error('please apply getButtonProps() to your <button>');
    }
    if (!announcerRef.current) {
      throw new Error('please apply getAnnouncerProps() to your <div>');
    }
  }, [
    sectionRef,
    headingRef,
    carouselWrapperRef,
    carouselRef,
    carouselItemRef,
    buttonRef,
    announcerRef,
  ]);

  useEffect(() => {
    // Listen for swipe direction changes. Apply appropriate translateX transition.
    if (currentSwipeDirection) {
      const transformArray = [
        { transform: 'translateX(-100%)' },
        { transform: 'translateX(0px)' },
      ];

      carouselRef?.current?.animate(
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
    ref: sectionRef,
    as: 'section',
    'aria-labelledby': 'carousel-heading',
    'aria-roledescription': 'carousel',
  });

  const getHeadingProps = () => ({
    ref: headingRef,
    id: 'carousel-heading',
  });

  const getCarouselWrapperProps = () => ({
    ref: carouselWrapperRef,
    style: { width: '100%', overflow: 'hidden' },
  });

  const getCarouselProps = () => ({
    ref: carouselRef,
    'aria-label': 'Slides',
    style: {
      display: 'flex',
    },
  });

  const getCarouselItemProps = (index: number) => ({
    ref: carouselItemRef,
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

  const getButtonProps = (
    direction: ActionKind.Previous | ActionKind.Next
  ) => ({
    ref: buttonRef,
    'aria-label': direction === ActionKind.Previous ? 'Previous' : 'Next',
    onClick: () => slide(direction),
  });

  const getAnnouncerProps = () => ({
    ref: announcerRef,
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
    getHeadingProps,
    getCarouselWrapperProps,
    getCarouselProps,
    getCarouselItemProps,
    getButtonProps,
    getAnnouncerProps,
    // state.
    state: {
      ...state,
      currentSwipeDirection,
    },
  };
};

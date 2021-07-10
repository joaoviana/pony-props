import { render } from 'react-dom';
import { useEffect, useRef } from 'react';
import { usePony } from './pony/usePony';
import { ActionKind } from './pony/usePony.interface';

const MyCarousel = () => {
  const sliderRef = useRef<HTMLUListElement>(null);
  const items = new Array(10).fill(null).map((_, idx) => ({
    id: idx,
    name: `item number ${idx}`,
  }));
  const {
    getSectionProps,
    getSectionHeadingProps,
    getCarouselProps,
    getCarouselItemProps,
    getCarouselButtonProps,
    getCarouselAnnouncerProps,
    state,
  } = usePony({ numItems: items.length });

  // TODO: move this to usepony
  useEffect(() => {
    // Listen for swipe direction changes. Apply appropriate translateX transition.
    if (state.currentSwipeDirection) {
      const transformArray = [
        { transform: 'translateX(-100%)' },
        { transform: 'translateX(0px)' },
      ];

      sliderRef?.current?.animate(
        state.currentSwipeDirection === ActionKind.Previous
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
  }, [state.activeSlideIndex, state.currentSwipeDirection, items.length]);

  return (
    <div {...getSectionProps()}>
      <h1 {...getSectionHeadingProps()}>Heading</h1>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <ul {...getCarouselProps()} ref={sliderRef}>
          {items.map((item, idx) => (
            <li key={idx} {...getCarouselItemProps(idx)}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <button {...getCarouselButtonProps(ActionKind.Previous)}>Previous</button>
      <button {...getCarouselButtonProps(ActionKind.Next)}>Next</button>
      <div {...getCarouselAnnouncerProps()}>
        <p>{`Item ${state.activeSlideIndex + 1} of ${items.length}`}</p>
      </div>
    </div>
  );
};

render(<MyCarousel />, document.getElementById('root'));

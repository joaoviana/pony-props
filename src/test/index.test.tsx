import { render } from '@testing-library/react';
import { usePony } from '../pony/usePony';
import '@testing-library/jest-dom';
import { ActionKind } from '../pony/usePony.interface';

const MyCarousel = () => {
  const {
    getSectionProps,
    getSectionHeadingProps,
    getCarouselProps,
    getCarouselItemProps,
    getCarouselButtonProps,
  } = usePony({ numItems: 1 });

  return (
    <div data-testid='section' {...getSectionProps()}>
      <h1 data-testid='heading' {...getSectionHeadingProps()}>
        Heading
      </h1>
      <li data-testid='carousel' {...getCarouselProps()}>
        <ul data-testid='carousel-item' {...getCarouselItemProps()}>
          Carousel Item
        </ul>
      </li>
      <button {...getCarouselButtonProps(ActionKind.Next)}>Next</button>
      <button {...getCarouselButtonProps(ActionKind.Previous)}>Previous</button>
    </div>
  );
};

describe('should render my carousel', () => {
  it('should have a section', () => {
    const { getByTestId } = render(<MyCarousel />);

    expect(getByTestId('section')).toHaveAttribute(
      'aria-labelledby',
      'carouselheading'
    );
    // TODO: end tests here
  });
  it('should have a heading', () => {
    const { getByTestId } = render(<MyCarousel />);

    expect(getByTestId('heading')).toHaveAttribute('id', 'carouselheading');
    // TODO: end tests here
  });
  it('should have a carousel', () => {
    const { getByTestId } = render(<MyCarousel />);

    expect(getByTestId('carousel')).toHaveAttribute('aria-label', 'Slides');
    // TODO: end tests here
  });
  it('should have a carousel item', () => {
    const { getByTestId } = render(<MyCarousel />);

    expect(getByTestId('carousel-item')).toHaveAttribute(
      'aria-roledescription',
      'slide'
    );
    // TODO: end tests here
  });
  it('should have 2 carousel buttons', () => {
    const { getByText } = render(<MyCarousel />);

    expect(getByText('Next')).toHaveAttribute('aria-label', 'Next');
    expect(getByText('Previous')).toHaveAttribute('aria-label', 'Previous');
    // TODO: end tests here
  });
});

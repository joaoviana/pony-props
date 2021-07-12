import React from 'react';
import { Meta, Story } from '@storybook/react';
import { usePony } from '../src/use-pony/usePony';
import { ActionKind } from '../src/use-pony/usePony.interface';

export const MyCarousel = () => {
  const items = new Array(10).fill(null).map((_, idx) => ({
    id: idx,
    name: `item number ${idx}`,
  }));
  const {
    getSectionProps,
    getHeadingProps,
    getCarouselWrapperProps,
    getCarouselProps,
    getCarouselItemProps,
    getButtonProps,
    getAnnouncerProps,
    state,
  } = usePony({ numItems: items.length });

  return (
    <div {...getSectionProps()}>
      <h1 {...getHeadingProps()}>Heading</h1>
      <div {...getCarouselWrapperProps()}>
        <ul {...getCarouselProps()}>
          {items.map((item, idx) => (
            <li key={idx} {...getCarouselItemProps(idx)}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <button {...getButtonProps(ActionKind.Previous)}>Previous</button>
      <button {...getButtonProps(ActionKind.Next)}>Next</button>
      <div {...getAnnouncerProps()}>
        <p>{`Item ${state.activeSlideIndex + 1} of ${items.length}`}</p>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Carousel',
  component: MyCarousel,
};

export default meta;

const Template: Story = (args) => <MyCarousel {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};

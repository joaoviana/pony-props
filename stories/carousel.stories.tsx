import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MyCarousel } from '../src/components/carousel';

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

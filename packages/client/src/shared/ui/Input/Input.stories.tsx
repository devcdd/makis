import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
  decorators: [
    (Story) => {
      const [value, setValue] = useState('');
      return (
        <div style={{ width: '300px' }}>
          <Story
            args={{
              value,
              onChange: setValue,
            }}
          />
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Value: "{value}"
          </p>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Pre-filled text',
    placeholder: 'Enter your text here',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Disabled text',
  },
};

export const WithCustomClassName: Story = {
  args: {
    placeholder: 'Custom styled input',
    className: 'border-red-500 focus:ring-red-500',
  },
};

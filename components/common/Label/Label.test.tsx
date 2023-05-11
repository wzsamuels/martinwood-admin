// Label.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Label from './Label';

describe('Label component', () => {
  test('renders label with children', () => {
    render(<Label>Label text</Label>);
    const labelElement = screen.getByText(/label text/i);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('LABEL');
  });

  test('applies custom className', () => {
    render(<Label className="custom-class">Custom Class Label</Label>);
    const labelElement = screen.getByText(/custom class label/i);
    expect(labelElement).toHaveClass('custom-class');
  });

  test('applies default class', () => {
    render(<Label>Default Class Label</Label>);
    const labelElement = screen.getByText(/default class label/i);
    expect(labelElement).toHaveClass('basis-[150px]');
  });
});

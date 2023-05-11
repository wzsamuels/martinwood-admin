// InputWrapper.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputWrapper from './InputWrapper';
import {vi} from "vitest";

describe('InputWrapper component', () => {
  test('renders wrapper with children', () => {
    render(
      <InputWrapper>
        <div>Child 1</div>
        <div>Child 2</div>
      </InputWrapper>
    );
    const child1 = screen.getByText(/child 1/i);
    const child2 = screen.getByText(/child 2/i);
    expect(child1).toBeInTheDocument();
    expect(child2).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <InputWrapper className="custom-class">
        <div>Custom Class Wrapper</div>
      </InputWrapper>
    );
    const wrapperElement = screen.getByText(/custom class wrapper/i).parentElement;
    expect(wrapperElement).toHaveClass('custom-class');
  });

  test('handles onClick event', () => {
    const handleClick = vi.fn();
    render(
      <InputWrapper onClick={handleClick}>
        <div>Click Event Wrapper</div>
      </InputWrapper>
    );
    const wrapperElement = screen.getByText(/click event wrapper/i).parentElement;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fireEvent.click(wrapperElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

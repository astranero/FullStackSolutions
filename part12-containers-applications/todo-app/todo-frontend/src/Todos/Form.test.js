import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from './Form';

describe('TodoForm', () => {
  test('renders TodoForm component', () => {
    render(<TodoForm createTodo={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('allows the user to submit a todo', () => {
    const createTodo = jest.fn(); 
    render(<TodoForm createTodo={createTodo} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Todo' } });

    fireEvent.click(screen.getByText('Submit'));

    expect(createTodo).toHaveBeenCalledWith({ text: 'New Todo' });
  });
});

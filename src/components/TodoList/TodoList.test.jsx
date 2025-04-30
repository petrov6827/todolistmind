import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from './';
import '@testing-library/jest-dom';

describe('TodoList Component', () => {
  test('adds new todo when Enter pressed', () => {
    render(<TodoList />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });
})
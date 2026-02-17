import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../../components/TaskForm';

// Mock fetch
global.fetch = jest.fn();

describe('TaskForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders form elements', () => {
    render(<TaskForm />);
    
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const mockOnCreate = jest.fn();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test Task', status: 'pending' })
    });

    render(<TaskForm onCreate={mockOnCreate} />);
    
    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Description (optional)');
    const prioritySelect = screen.getByDisplayValue('medium');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high'
        })
      });
    });

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith({
        id: '1',
        title: 'Test Task',
        status: 'pending'
      });
    });

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
    expect(prioritySelect.value).toBe('medium');
  });

  test('shows error for empty title', async () => {
    render(<TaskForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  test('shows error for whitespace-only title', async () => {
    render(<TaskForm />);
    
    const titleInput = screen.getByPlaceholderText('Task title');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  test('handles API error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' })
    });

    render(<TaskForm />);
    
    const titleInput = screen.getByPlaceholderText('Task title');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  test('disables form during submission', async () => {
    fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<TaskForm />);
    
    const titleInput = screen.getByPlaceholderText('Task title');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(submitButton);

    expect(screen.getByRole('button', { name: 'Adding…' })).toBeInTheDocument();
    expect(titleInput).toBeDisabled();
    expect(screen.getByDisplayValue('medium')).toBeDisabled();
  });

  test('trims title and description', async () => {
    const mockOnCreate = jest.fn();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test Task', status: 'pending' })
    });

    render(<TaskForm onCreate={mockOnCreate} />);
    
    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Description (optional)');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });

    fireEvent.change(titleInput, { target: { value: '  Test Task  ' } });
    fireEvent.change(descriptionInput, { target: { value: '  Test Description  ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium'
        })
      });
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LinkInput } from '../../src/components/analyzer/LinkInput';

describe('LinkInput component', () => {
  it('renders input field and analyze button', () => {
    render(<LinkInput onAnalyze={vi.fn()} />);
    expect(
      screen.getByLabelText(/Enter or paste destination web link/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Analyze Link/i })
    ).toBeInTheDocument();
  });

  it('shows accessible validation error when submitting empty input', async () => {
    const handleAnalyze = vi.fn();
    render(<LinkInput onAnalyze={handleAnalyze} />);

    const button = screen.getByRole('button', { name: /Analyze Link/i });
    await userEvent.click(button);

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent(/Please enter or paste a URL to inspect/i);
    expect(handleAnalyze).not.toHaveBeenCalled();
  });

  it('calls onAnalyze with trimmed input on valid submission', async () => {
    const handleAnalyze = vi.fn();
    render(<LinkInput onAnalyze={handleAnalyze} />);

    const input = screen.getByLabelText(/Enter or paste destination web link/i);
    await userEvent.type(input, '  https://example.com/menu  ');

    const button = screen.getByRole('button', { name: /Analyze Link/i });
    await userEvent.click(button);

    expect(handleAnalyze).toHaveBeenCalledWith('https://example.com/menu');
  });

  it('supports Enter key submission', async () => {
    const handleAnalyze = vi.fn();
    render(<LinkInput onAnalyze={handleAnalyze} />);

    const input = screen.getByLabelText(/Enter or paste destination web link/i);
    await userEvent.type(input, 'https://example.org{Enter}');

    expect(handleAnalyze).toHaveBeenCalledWith('https://example.org');
  });

  it('clears input when clicking clear button', async () => {
    render(<LinkInput onAnalyze={vi.fn()} />);

    const input = screen.getByLabelText(/Enter or paste destination web link/i);
    await userEvent.type(input, 'https://example.com');

    const clearButton = screen.getByRole('button', { name: /Clear input/i });
    await userEvent.click(clearButton);

    expect(input).toHaveValue('');
  });
});

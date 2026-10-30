import { describe, it, expect } from 'vitest';
import { generateQrMatrix, renderQrSvgString } from '../src/utils/qrCodeGenerator.js';

describe('QR Code Generator (Zero-Dependency Offline)', () => {
  it('generates a valid square matrix for standard URLs', () => {
    const url = 'https://impactgrid-demo.telkomsel.com';
    const matrix = generateQrMatrix(url);
    expect(Array.isArray(matrix)).toBe(true);
    expect(matrix.length).toBeGreaterThanOrEqual(21);
    expect(matrix.length).toBe(matrix[0].length); // Square
  });

  it('renders a valid SVG containing crisp rectangles', () => {
    const url = 'http://localhost:5173';
    const svg = renderQrSvgString(url, 200);
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox');
    expect(svg).toContain('<rect');
    expect(svg).toContain('</svg>');
  });
});

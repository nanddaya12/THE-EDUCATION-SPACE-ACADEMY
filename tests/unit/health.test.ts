import { describe, it, expect } from 'vitest';
import { createApp } from '../../server/app';

describe('Server Infrastructure Health Check', () => {
  it('should initialize Express app factory cleanly', () => {
    const app = createApp();
    expect(app).toBeDefined();
  });
});

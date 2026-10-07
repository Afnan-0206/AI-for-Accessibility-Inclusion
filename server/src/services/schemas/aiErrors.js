/**
 * Custom error thrown when the AI response cannot be parsed or validated
 * against the expected analysisSchema shape.
 *
 * Usage:
 *   throw new AIParsingError('Validation failed after retry', { cause: zodError });
 */
export class AIParsingError extends Error {
  /**
   * @param {string} message  - Human-readable description of what went wrong.
   * @param {{ cause?: unknown }} [options] - Optional cause for error chaining.
   */
  constructor(message, options) {
    super(message, options);
    this.name = 'AIParsingError';

    // Maintain proper prototype chain in environments that transpile classes.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

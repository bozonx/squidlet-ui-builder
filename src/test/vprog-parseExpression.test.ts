import { describe, it, expect } from 'vitest';
import { parseExpression } from '@/vprog/expressionParser';

describe('parseExpression', () => {
  it('should parse a simple expression', () => {
    const expression = 'myFunc(1 + 2)';
    const result = parseExpression(expression);
    expect(result).toEqual({
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'myFunc',
      },
      arguments: [
        {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Literal', raw: '1', value: 1 },
          right: { type: 'Literal', raw: '2', value: 2 },
        },
      ],
    });
  });
});

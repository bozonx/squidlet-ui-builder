import { makeComponent } from '@/translators/vue/makeComponent';
import { ComponentSchema } from '@/types/ComponentSchema';
import { describe, it, expect } from 'vitest';

describe('Translator Vue', () => {
  describe('template items', () => {
    it('template element and text', () => {
      const schema: ComponentSchema = {
        template: [
          {
            type: 'Element',
            tag: 'div',
            props: {
              class: {
                type: 'string',
                value: 'some-class',
              },
            },
            children: [
              {
                type: 'Text',
                value: 'Hello',
              },
            ],
          },
        ],
      };

      const result = `<template>
<div class="some-class">\nHello\n</div>
</template>`;
      expect(makeComponent(schema)).toBe(result);
    });
  });

  it('if', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'If',
          condition: 'isVisible',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<template v-if="isVisible">\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('else', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'Else',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<template v-else>\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('if else', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'IfElse',
          condition: 'isVisible',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<template v-else-if="isVisible">\nHello\n</template>\n<template v-else>\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('for', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'For',
          array: 'items',
          item: 'item',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<template v-for="(${item}, index) in ${array}">\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });
});
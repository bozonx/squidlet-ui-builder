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

    it('props', () => {
      const schema: ComponentSchema = {
        props: {
          className: {
            type: 'string',
            value: 'button',
          },
        },
      };

      const result =
        `<script setup>\n` +
        `const props = defineProps({\nclassName: String,\n})\n` +
        `</script>\n`;
      expect(makeComponent(schema)).toBe(result);
    });
  });
});

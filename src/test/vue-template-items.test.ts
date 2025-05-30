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

  it('else if', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'ElseIf',
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

    const result = `<template>\n<template v-else-if="isVisible">\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('for with array', () => {
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

    const result = `<template>\n<template v-for="(item, index) in items">\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('for with object', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'For',
          object: 'items',
          item: 'item',
          key: 'key',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<template v-for="(item, key, index) in items">\nHello\n</template>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('router view', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'RouterView',
        },
      ],
    };

    const result = `<template>\n<RouterView></RouterView>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('router link', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'RouterLink',
          to: 'to',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<RouterLink to="to">\nHello\n</RouterLink>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('slot', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'Slot',
          name: 'name',
          children: [
            {
              type: 'Text',
              value: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>\n<slot name="name">\nHello\n</slot>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('props: expression, boolean, number', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'Component',
          component: 'Button',
          props: {
            expression: {
              type: 'expression',
              value: '1 + 1',
            },
            num: {
              type: 'number',
              value: 1,
            },
            bool: {
              type: 'boolean',
              value: true,
            },
          },
        },
      ],
    };

    const result = `<template>\n<Button :expression="1 + 1" :num="1" :bool="true"></Button>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('on event', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'Element',
          tag: 'button',
          on: {
            click: {
              expr: 'addElement()',
            },
          },
        },
      ],
    };

    const result = `<template>\n<button @click="addElement()"></button>\n</template>`;
    expect(makeComponent(schema)).toBe(result);
  });
});
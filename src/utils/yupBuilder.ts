// src/utils/yupBuilder.ts
import * as yup from 'yup';
import type { Form, Element } from '../types/general';

/**
 * Build a Yup validation schema for given form.
 * - If element has conditions referencing targetElementId, use .when to conditionally require.
 */
export function buildYupSchema(form: Form) {
  const shape: Record<string, any> = {};

  const getBaseSchema = (el: Element) => {
    switch (el.type) {
      case 'text':
        return el.isRequired ? yup.string().required(`${el.label} is required`) : yup.string().nullable();
      case 'checkbox':
        // If choices exist => array of selected choice ids (strings)
        if (el.choices && el.choices.length > 0) {
          return el.isRequired
            ? yup.array().of(yup.string()).min(1, `${el.label} is required`)
            : yup.array().of(yup.string());
        }
        // single boolean checkbox
        return el.isRequired ? yup.boolean().oneOf([true], `${el.label} must be checked`) : yup.boolean();
      default:
        return yup.mixed();
    }
  };

  for (const el of form.elements) {
    const base = getBaseSchema(el);

    if (el.conditions && el.conditions.length > 0) {
      // for now we support only single condition that references one target element.
      // If multiple conditions exist, we'll combine with logical AND.
      const deps = el.conditions.map((c) => c.targetElementId);
      // build when with array dependency
      shape[el.id] = yup.mixed().when(deps, (...args: any[]) => {
        const values = args.slice(0, deps.length);
        // last arg is the schema
        const originalSchema: yup.Schema<any> = args[deps.length];
        // evaluate if all conditions match
        const allMatch = el.conditions!.every((cond, idx) => {
          const targetValue = values[idx];
          // Loose equality check; adapt as needed
          return targetValue === cond.valueToMatch;
        });
        return allMatch ? base : originalSchema.notRequired();
      });
    } else {
      shape[el.id] = base;
    }
  }

  return yup.object().shape(shape);
}

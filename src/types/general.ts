export interface Choice {
  id: string;
  name: string;
}

export interface Condition {
  targetElementId: string;
  valueToMatch: any;
}

export type ElementType = 'text' | 'checkbox';

export interface Element {
  id: string;
  type: ElementType;
  label: string;
  isRequired?: boolean;
  choices?: Choice[]; // if present and type === 'checkbox' => checkbox group
  // show/hide conditions: show this element only when ALL conditions are satisfied
  conditions?: Condition[];
}

export interface Form {
  id: string;
  name: string;
  elements: Element[];
}

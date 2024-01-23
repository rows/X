type Nullable<T> = T | null;

interface DomElement extends Element {
  innerText: string;
  poster: string;
  src: string;
  href: string;
  previousElementSibling: DOM_Element;
}

export type DOM_Element = Nullable<DomElement>;

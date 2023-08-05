export interface TypedRefModal {
  show: () => void;
  hide: () => void;
}

export interface TypedRegexProps {
  validation: RegExp;
  error?: string;
}

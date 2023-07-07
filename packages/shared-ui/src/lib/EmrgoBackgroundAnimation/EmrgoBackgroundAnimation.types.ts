export interface IEmrgoBackgroundAnimationProps {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface IntrinsicElements {
      "model-viewer": MyElementAttributes;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface MyElementAttributes {
      src: string;
      alt: string;
      "interaction-prompt-threshold": string;
      "ar-status": string;
      style?: React.CSSProperties | undefined;
      "auto-rotate": boolean;
    }
  }
}

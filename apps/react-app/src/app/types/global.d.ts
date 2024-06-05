// global.d.ts

export {}; // Ensures TypeScript treats this file as a module

// Extend the global Window interface
declare global {
  const assembly: any;
  interface Window {
    frankieFinancial: {
      initialiseOnboardingWidget: (config: {
        applicantReference: string;
        config: any; // Consider replacing `any` with a more specific type if possible
        width: string;
        height: string;
        ffToken: string;
      }) => Promse<void>;
    };
    OneSdk: any;
  }
}

// Extend JSX with the custom element
declare namespace JSX {
  interface IntrinsicElements {
    'ff-onboarding-widget': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}

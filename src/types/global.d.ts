declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => any;
    };
  }
}

export {};
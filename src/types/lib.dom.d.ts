interface Window {
  readonly api: {
    get: (command: string, data?: { [key: string]: any }) => Promise<any>;
    post: (command: string, data?: { [key: string]: any }) => Promise<any>;
  };
}


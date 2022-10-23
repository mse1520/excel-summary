interface Window {
  readonly api: {
    get: <T = any, R = any>(command: string, data?: T) => Promise<R>;
    post: <T = any, R = any>(command: string, data?: T) => Promise<R>;
  };
}
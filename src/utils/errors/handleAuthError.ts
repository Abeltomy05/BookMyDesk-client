export class HandledAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HandledAuthError";
  }
}
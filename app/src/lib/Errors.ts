export class SensitiveImageError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

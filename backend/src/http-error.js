// Thrown by routes; the error handler in server.js turns it into the PRD section 8 JSON format.
export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

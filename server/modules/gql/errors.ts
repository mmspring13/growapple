export class AppApolloError extends Error {
  constructor(public message: string, public code: AppApolloErrorCodes, public payload: unknown) {
    super(message);

    this.message = message;
    this.payload = payload;
    this.code = code;
  }

  static is(err: unknown): err is AppApolloError {
    return err instanceof AppApolloError;
  }
}

export class AppApolloDepthError extends AppApolloError {
  constructor(message: string, code: AppApolloErrorCodes, payload: unknown, public limit: number) {
    super(message, code, payload);

    this.limit = limit;
  }

  static is(err: unknown): err is AppApolloError {
    return err instanceof AppApolloDepthError;
  }
}

export enum AppApolloErrorCodes {
  "UFO",
  "EXCEEDED_DEPTH_CHILDREN",
  "EXCEEDED_DEPTH_PARENTAGE",
}

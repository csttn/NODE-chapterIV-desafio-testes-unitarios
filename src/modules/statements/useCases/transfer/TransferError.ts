import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class TransferInvalid extends AppError {
    constructor() {
      super('Transfer invalid', 406);
    }
  }

  export class InvalidAmount extends AppError {
    constructor() {
      super('Invalid amount', 406);
    }
  }
  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 406);
    }
  }
}

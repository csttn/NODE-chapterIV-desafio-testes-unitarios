import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "./../../../users/repositories/IUsersRepository";
import { OperationType } from "./../../entities/Statement";
import { IStatementsRepository } from "./../../repositories/IStatementsRepository";
import { TransferError } from "./TransferError";

interface IRequest {
  user_id: string;
  transfer_destination_user_id: string;
  amount: number;
  description: string;
}

@injectable()
export class TransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    transfer_destination_user_id,
    amount,
    description,
  }: IRequest) {
    const user = await this.usersRepository.findById(user_id);
    const user_destination = await this.usersRepository.findById(
      transfer_destination_user_id
    );

    if (!user || !user_destination) {
      throw new TransferError.UserNotFound();
    }

    const balanceUserTranfer = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true,
    });
    const balanceUserDestinationTranfer = await this.statementsRepository.getUserBalance({
      user_id: transfer_destination_user_id,
      with_statement: true,
    });

    if (amount <= 0) {
      throw new TransferError.InvalidAmount();
    }

    if (balanceUserTranfer.balance < amount) {
      throw new TransferError.InsufficientFunds();
    }

    const statementOperationUserTransfer =
      await this.statementsRepository.create({
        user_id,
        type: OperationType.TRANSFER,
        amount,
        description,
      });

    const statementOperationUserReceivingTransfer =
      await this.statementsRepository.create({
        user_id: transfer_destination_user_id,
        type: OperationType.RECEIVE_TRANFER,
        amount,
        description,
      });

    return {
      statementOperationUserTransfer,
      statementOperationUserReceivingTransfer,
    };
  }
}

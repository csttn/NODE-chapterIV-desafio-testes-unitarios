import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferUseCase } from "./TransferUseCase";

export class TransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { transfer_destination_user_id } = request.params;
    const { amount, description } = request.body;

    const createTransfer = container.resolve(TransferUseCase);

    const statement = await createTransfer.execute({
      user_id,
      transfer_destination_user_id,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}

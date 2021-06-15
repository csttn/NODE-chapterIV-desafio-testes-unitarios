import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "@modules/statements/entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(async () => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should be able to create a new statement", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name: "name",
      password: "password123",
    };

    const userResult = await createUserUseCase.execute(user);

    const statementResult = await createStatementUseCase.execute({
      user_id: userResult.id,
      amount: 200,
      description: "Ganhei no jogo do bicho",
      type: OperationType.DEPOSIT,
    });

    expect(statementResult).toHaveProperty("id");
    expect(statementResult).toHaveProperty("user_id");
    expect(statementResult).toHaveProperty("description");
    expect(statementResult).toHaveProperty("amount");
    expect(statementResult).toHaveProperty("type");
  });

  it("should not be able create a new statement with user id incorrect", async () => {
    expect(async () => {
      const statementResult = await createStatementUseCase.execute({
        user_id: "sdfsdfssdfs",
        amount: 200,
        description: "Ganhei no jogo do bicho",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able create a new statement with insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name: "name",
        password: "password123",
      };

      const userResult = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: userResult.id,
        amount: 900000,
        description: "Ganhei no jogo do bicho",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});

import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "@modules/statements/entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

let createStatementUseCase: CreateStatementUseCase;

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Get Statement Operation", () => {
  beforeEach(async () => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should be able return balance", async () => {
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

    const statementOperationResult = await getStatementOperationUseCase.execute(
      { statement_id: statementResult.id, user_id: userResult.id }
    );

    expect(statementOperationResult).toHaveProperty("id");
    expect(statementOperationResult).toHaveProperty("user_id");
    expect(statementOperationResult).toHaveProperty("description");
    expect(statementOperationResult).toHaveProperty("amount");
    expect(statementOperationResult).toHaveProperty("type");
  });

  it("should not be able return balance with user not found", async () => {
    expect(async () => {
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

      await getStatementOperationUseCase.execute({
        statement_id: statementResult.id,
        user_id: "UserIdIcorrect",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able return balance with statement not found", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name: "name",
        password: "password123",
      };

      const userResult = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: userResult.id,
        amount: 200,
        description: "Ganhei no jogo do bicho",
        type: OperationType.DEPOSIT,
      });

      await getStatementOperationUseCase.execute({
        statement_id: "StatementIDIncorrect",
        user_id: userResult.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});

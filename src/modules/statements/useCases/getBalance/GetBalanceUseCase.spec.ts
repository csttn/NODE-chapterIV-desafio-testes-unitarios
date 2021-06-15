import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository,
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should be able to get a balance", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name: "name",
      password: "password123",
    };

    const userResult = await createUserUseCase.execute(user);

    const balance = await getBalanceUseCase.execute({ user_id: userResult.id });

    expect(balance).toHaveProperty("statement");
  });

  it("should not be able get a balance with user_id incorrect", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "IncorrectId",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});

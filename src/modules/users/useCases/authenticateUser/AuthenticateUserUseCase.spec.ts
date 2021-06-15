import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticatedUserUseCase: AuthenticateUserUseCase;

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AuthenticatedUser", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    authenticatedUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Teste nome",
      email: "teste@email.com",
      password: "teste123",
    };

    await createUserUseCase.execute(user);

    const result = await authenticatedUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able authenticate an user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Teste nome",
        email: "teste@email.com",
        password: "teste123",
      };

      await createUserUseCase.execute(user);

      const result = await authenticatedUserUseCase.execute({
        email: "email@incorrect.com",
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});

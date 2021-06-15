import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("CreateUser", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name: "name",
      password: "password123",
    };

    await createUserUseCase.execute(user);

    const userCreated = await inMemoryUserRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });
  it("should not be able create a new user with the existing email ", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name: "name",
        password: "password123",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});

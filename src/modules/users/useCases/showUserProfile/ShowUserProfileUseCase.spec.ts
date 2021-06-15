import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { User } from "../../entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;

describe("Show Profile User", () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("must return user information", async () => {
    const user: ICreateUserDTO = {
      email: "email@email.com",
      name: "name",
      password: "password123",
    };

    const userCreated = await createUserUseCase.execute(user);

    const resp = await showUserProfileUseCase.execute(userCreated.id);

    expect(resp).toBeInstanceOf(User);
    expect(resp).toHaveProperty("email");
  });

  it("should not be able return user information", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@email.com",
        name: "name",
        password: "password123",
      };

      await createUserUseCase.execute(user);

      await showUserProfileUseCase.execute("incorrectId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});

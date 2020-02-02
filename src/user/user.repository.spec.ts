import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { User } from "./user.entity";

const mockCredentialsDto = {
  username: "TestUsername",
  password: "TestPassword123"
};

let userRepository;
const user = {};
describe("UserRepository", () => {
  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [UserRepository]
    }).compile();

    userRepository = await testModule.get<UserRepository>(UserRepository);
  });
  describe("addUser", () => {
    beforeEach(() => {
      userRepository.create = jest.fn();
      userRepository.save = jest.fn();
    });
    it("successfully add a user", () => {
      userRepository.create.mockReturnValue(user);
      userRepository.save.mockResolvedValue("success");
      expect(userRepository.addUser(mockCredentialsDto)).resolves.not.toThrow();
    });
    it("throws a conflict exception as username already exists", () => {
      userRepository.create.mockReturnValue(user);
      userRepository.save.mockRejectedValue({ code: "23505" });
      expect(userRepository.addUser(mockCredentialsDto)).rejects.toThrow(
        ConflictException
      );
    });
    it("throws a conflict exception as username already exists", () => {
      userRepository.create.mockReturnValue(user);
      userRepository.save.mockRejectedValue({ code: "2350" });
      expect(userRepository.addUser(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
  describe("validateCredentials", () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = mockCredentialsDto.username;
      user.password = mockCredentialsDto.password;
      user.validatePassword = jest.fn();
    });

    it("returns the username as validation is successful", async () => {
      user.validatePassword.mockResolvedValue(true);
      userRepository.findOne.mockResolvedValue(user);
      const result = await userRepository.validateCredentials(
        mockCredentialsDto
      );
      expect(result).toEqual(user);
    });
    it("throws unauthorized exception as user cannot be found", () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(
        userRepository.validateCredentials(mockCredentialsDto)
      ).rejects.toThrow(UnauthorizedException);
      expect(user.validatePassword).not.toHaveBeenCalled();
    });
    it("throws unauthorized exception as password is invalid", async () => {
      user.validatePassword.mockResolvedValue(false);
      userRepository.findOne.mockResolvedValue(user);
      expect(
        userRepository.validateCredentials(mockCredentialsDto)
      ).rejects.toThrow(UnauthorizedException);
      try {
        await userRepository.validateCredentials(mockCredentialsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(user.validatePassword).toHaveBeenCalled();
      }
    });
  });
  describe("bcrypt.hash have been called in validate", () => {});
});

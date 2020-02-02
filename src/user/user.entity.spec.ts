import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

let user: User;
let correctPassword: string;
let wrongPassword: string;

describe("User entity", () => {
  beforeEach(async () => {
    user = new User();
    user.salt = await bcrypt.genSalt(10);
    correctPassword = "123456";
    wrongPassword = "12345";
  });

  describe("validatePassword", () => {
    it("returns true as password is valid", async () => {
      user.password = await bcrypt.hash(correctPassword, user.salt);
      const result = await user.validatePassword(correctPassword);
      expect(result).toEqual(true);
    });
    it("returns false as password is invalid", async () => {
      user.password = await bcrypt.hash(correctPassword, user.salt);
      const result = await user.validatePassword(wrongPassword);
      expect(result).toEqual(false);
    });
  });
});

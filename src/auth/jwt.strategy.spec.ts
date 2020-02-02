import { JwtStrategy } from "./jwt.strategy";
import { Test } from "@nestjs/testing";

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;
  let testPayload;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [JwtStrategy]
    }).compile();
    jwtStrategy = await testModule.get<JwtStrategy>(JwtStrategy);
  });

  it("validate method will return correct userId", async () => {
    testPayload = { userId: 123456 };
    const result = jwtStrategy.validate(testPayload);
    expect(result).toEqual(testPayload.userId);
  });
});

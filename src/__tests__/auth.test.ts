import request from "supertest";
import app from "../app";

describe("Authentication API", () => {
  const signUpExistingUserData = {
    firstName: "John",
    lastName: "Doe",
    email: "jon@example.com",
    password: "password123",
  };

  const signUpNewUserData = {
    firstName: "John",
    lastName: "Doe",
    email: "jhammmmmmm@example.com",
    password: "password123",
  };

  const logInUserData = {
    email: "jon@example.com",
    password: "password123",
  };

  test("should try to signup an existing user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(signUpExistingUserData)
      .expect("Content-Type", /json/)
      .expect(409);

    expect(response.body.status).toBe("fail");
  });

  test("should signup a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(signUpNewUserData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.status).toBe("success");
  });

  test("should login an existing user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(logInUserData)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.token).toBeDefined();
    expect(response.body.data.user).toBeDefined();
  });
});

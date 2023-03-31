import { generateJWT } from "../services/auth.service";
import { createUser, getUserByEmail } from "../services/user.service";

export const createNewUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const userExists = await getUserByEmail(email).catch((e) => {
    throw e || new Error("problem checking user exists");
  });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await createUser(email, password).catch((e) => {
    throw e;
  });
  if (!user) {
    throw new Error("Problem Creating User");
  }

  const body = { _id: user.id, email: user.email };
  const token = generateJWT(body);
  if (!token) {
    throw new Error("Account created, but Problem creating token");
  }
  return token;
};

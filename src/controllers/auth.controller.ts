import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { hashPassword, correctPassword } from "../helpers/auth.helpers";
import { JWTData } from "../interfaces/interface";

const signToken = (id: string) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: User,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cant manipulate cookie in any way ie cant delete the cookie
    secure: req.secure,
  };

  res.cookie("jwt", token, cookieOptions);

  // user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    // CHECK IF USER ALREADY EXISTS
    const oldUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (oldUser)
      return next(new AppError("User already exists. Please login", 409));

    const newUser = await User.create({
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword(req.body.password),
      role: req.body.role,
    });

    createSendToken(newUser, 201, req, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // check if username or password was entered
    if (!email || !password) {
      return next(new AppError("Please enter email and password", 400));
    }

    // check if user exists and password is correct
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !correctPassword(password, user.password)) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // if everything is okay, send token to client and login
    createSendToken(user, 200, req, res);
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get the token and check if it exists
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You aren't logged in. Kindly log in to get access.", 401)
      );
    }

    // Verify token
    const decoded: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = (decoded as JWTData).id;

    // Check if user still exists
    const currentUser = await User.findByPk(userId);

    if (!currentUser) {
      return next(
        new AppError("The user with this token no longer exists.", 401)
      );
    }

    // Grant access to protected route
    req.body.user = currentUser; // req.body.user stores the user data and is only available on protected routes
    res.locals.user = currentUser;

    next();
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.body.role)) {
      return next(
        new AppError(
          "Access denied. You are not allowed to perform this operation.",
          403
        )
      );
    }

    next();
  };

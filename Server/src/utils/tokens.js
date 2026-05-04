import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../config/env.js";

export const signAccessToken = (payload) =>
  jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, JWT_ACCESS_SECRET);

export const verifyRefreshJwt = (refreshToken) =>
  jwt.verify(refreshToken, JWT_REFRESH_SECRET);

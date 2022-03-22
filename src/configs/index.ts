require("dotenv").config();

export const PORT = process.env.PORT
export const MONGO_USERNAME = process.env.MONGO_USERNAME
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD
export const MONGO_HOST = process.env.MONGO_HOST
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const SOCKET_PORT = process.env.SOCKET_PORT;
import type { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      user_id: string;
      email: string;
    };
  }
};
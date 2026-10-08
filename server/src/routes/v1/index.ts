import { Router } from "express";
import { codeRouter } from "./code.router.js";
import { promptRouter } from "./prompt.router.js";

const v1Router = Router();

v1Router.use("/code", codeRouter);
v1Router.use("/prompt", promptRouter);

export { v1Router };

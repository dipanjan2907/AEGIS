import { Router } from "express";
import { codeRouter } from "./code.router.js";
import { promptRouter } from "./prompt.router.js";
import { configRouter } from "./config.router.js";
import { dependencyRouter } from "./dependency.router.js";
import { logRouter } from "./log.router.js";

const v1Router = Router();

v1Router.use("/code", codeRouter);
v1Router.use("/prompt", promptRouter);
v1Router.use("/config", configRouter);
v1Router.use("/dependency", dependencyRouter);
v1Router.use("/log", logRouter);

export { v1Router };
import { Router } from "express";
import { codeRouter } from "./code.router.js";
import { promptRouter } from "./prompt.router.js";
import { configRouter } from "./config.router.js";
const v1Router = Router();
v1Router.use("/code", codeRouter);
v1Router.use("/prompt", promptRouter);
v1Router.use("/config", configRouter);
export { v1Router };
//# sourceMappingURL=index.js.map
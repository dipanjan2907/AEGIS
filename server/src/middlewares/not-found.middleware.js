import { NotFoundError } from "../errors/not-found.error.js";
export const notFoundMiddleware = (req, _res, next) => {
    next(new NotFoundError(`Route not found: ${req.method} ${req.path}`));
};
//# sourceMappingURL=not-found.middleware.js.map
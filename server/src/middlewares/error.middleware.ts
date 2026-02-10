import type { ErrorRequestHandler} from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.log("Error: ", err);
    const status =
        typeof err === "object" &&
        err !== null &&
        "statusCode" in err
            ? (err as any).statusCode
            : 500;

    res.status(status).json({ message: err instanceof Error ? err.message : "Internal Server Error" });
};
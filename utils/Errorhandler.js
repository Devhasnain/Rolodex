"use strict"

class NotFoundError extends Error { }
class AuthenticationError extends Error { }

export function Errorhandler(error, res) {
    let msg;
    let statusCode;
    let status = false

    if (error instanceof Error) {
        if (error instanceof NotFoundError) {
            msg = "Resource not found.";
            statusCode = 404;
        } else if (error instanceof AuthenticationError) {
            msg = "Authentication failed.";
            statusCode = 401;
        } else {
            msg = error.message ?? "Unexpected error occured";
            statusCode = 500;
        }
    } else {
        msg = error?.message;
        statusCode = 500;
    }

    return res.status(statusCode).json({ msg, status });
};

export function ErrroResponseHandler({ status, res }) {
    let msg;
    if (status === 404) {
        msg = "Not found"
    } else if (status === 400) {
        msg = "Bad Request"
    } else {
        msg = "Unexpected Error occured"
    }

    return res.status(status).json({ msg, status: false });
}
import { NextFunction, Request, Response } from 'express';

import * as httpStatus from 'http-status';
import { ApiError } from './ApiError';

export const errorConverter = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode
			? httpStatus.BAD_REQUEST
			: httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new ApiError(statusCode, message, false, err.stack);
	}
	next(error);
};

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let { statusCode, message } = err;
	if (process.env.ENVIRONMENT === 'production' && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...(process.env.ENVIRONMENT === 'development' && { stack: err.stack }),
	};

	if (process.env.ENVIRONMENT === 'development') {
		console.error(err);
	}

	res.status(statusCode).send(response);
};

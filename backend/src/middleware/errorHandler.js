/**
 * Global error handling middleware
 */
const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // express-validator errors
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    errors = err.array();
    message = 'Validation failed';
  }

  console.error('[Error]', err);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

/**
 * 404 handler for undefined routes
 */
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
}

module.exports = { errorHandler, notFoundHandler };

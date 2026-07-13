const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack
    });
};

module.exports = errorHandler;
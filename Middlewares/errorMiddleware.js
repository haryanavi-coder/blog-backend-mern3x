function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }
    
    console.log("ERROR MIDDLEWARE CALLED")
    res.status(500).json({
        ok: false, // Set the "ok" field to false for errors
        message: err.message,
    });
}

module.exports = errorHandler;
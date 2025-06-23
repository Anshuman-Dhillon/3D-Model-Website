const errorHandler = (err, req, res, next) => {

    if (err.status) {
        console.log("do whatever");
    } else {
        res.status(500).json({msg: err.message});
    }
}

export default errorHandler;
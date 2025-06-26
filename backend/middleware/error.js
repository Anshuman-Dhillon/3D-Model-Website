const errorHandler = (err, req, res, next) => {

    if (err.status) {
        console.log({ msg: err.message });
    } else {
        res.status(500).json({msg: err.message});
    }
}

export default errorHandler;
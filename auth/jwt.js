const jwt = require('jsonwebtoken');

const checkHeaderSetUser = (req, res, next) => {
    const authHeader = req.get('authorization');
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if(!err) {
                req.user = user;
            }
            next();
        });
    } else {
        next();
    }
}

const isLoggedIn = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        const err = new Error('Un-Authorized');
        res.status(401);
        next(err);
    }
}

module.exports = {
    checkHeaderSetUser,
    isLoggedIn
}
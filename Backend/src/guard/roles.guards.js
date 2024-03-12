class RolesGuard {
    
    customer = (req, res, next) => {
        if (req.session.isLogin) {
            next();
        } else {
            const error = new Error('Forbidden');
            error.status = 403;
            throw error
        }
    }

    supplier = (req, res, next) => {
        if (req.session.isAdmin) {
            next();
        } else {
            const error = new Error('Forbidden');
            error.status = 403;
            throw error
        }
    }
}

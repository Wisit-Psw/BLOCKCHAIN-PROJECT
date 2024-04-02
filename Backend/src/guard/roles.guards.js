class RolesGuard {
    isAsuthenticated = (req, res, next) => {
        if (req.session.user?.isCustomer || req.session.user?.isSupplier) {
            next();
        } else {
            const error = new Error('Forbidden');
            error.status = 403;
            throw error
        }
    }
    
    isCustomer = (req, res, next) => {
        if (req.session.user?.isCustomer) {
            next();
        } else {
            const error = new Error('Forbidden');
            error.status = 403;
            throw error
        }
    }

    isSupplier = (req, res, next) => {
        if (req.session.user?.isSupplier) {
            next();
        } else {
            const error = new Error('Forbidden');
            error.status = 403;
            throw error
        }
    }
}

module.exports = new RolesGuard();
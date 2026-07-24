// ==========================================
// ROLE-BASED AUTHORIZATION MIDDLEWARE
// ==========================================
// This is a "Higher-Order Function" (a function that returns another function).
// It is used in routes like this: router.post('/', protect, authorize('admin', 'owner'), createVehicle);
// 
// The (...roles) syntax is the "rest parameter". It takes all the arguments passed to it (e.g. 'admin', 'owner') 
// and bundles them into an array called `roles`.
const authorize = (...roles) => {
    
    // It returns the actual Express middleware function.
    // Note: This middleware MUST run AFTER the 'protect' middleware (auth.middleware.js), 
    // because it relies on `req.user` having already been fetched and attached to the request.
    return (req, res, next) => {
        
        // 1. Check if req.user exists (failsafe in case 'protect' didn't run).
        // 2. Check if the logged-in user's role (e.g. 'customer') is included in the allowed `roles` array (e.g. ['admin', 'owner']).
        if (!req.user || !roles.includes(req.user.role)) {
            
            // If the condition fails, return a 403 Forbidden status. 
            // (401 means "You are not logged in". 403 means "You are logged in, but you don't have permission to do this".)
            return res.status(403).json({
                message: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route`
            });
        }
        
        // If the user's role IS in the allowed array, let them proceed to the controller.
        next();
    };
};

module.exports = { authorize };

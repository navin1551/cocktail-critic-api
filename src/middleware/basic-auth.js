const AuthService = require("../auth/auth-service");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";
  let basicToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing basic token" });
  } else {
    basicToken = authToken.slice(7, authToken.length);
  }

  const isAuthenticated = AuthService.verifyJwt(basicToken);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  AuthService.getUserWithUserName(req.app.get("db"), isAuthenticated.sub)
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Unauthorized request" });
      }
      req.user = user;
      next();
    })
    .catch(next);
}

module.exports = {
  requireAuth
};

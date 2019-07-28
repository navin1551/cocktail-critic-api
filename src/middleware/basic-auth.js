const AuthService = require("../auth/auth-service");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";
  let basicToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing basic token" });
  } else {
    basicToken = authToken.slice(7, authToken.length);
  }

  /*
  console.log(
    Buffer.from(basicToken, "base64")
      .toString()
      .split(":")
  );
  const [tokenUserName, tokenPassword] = Buffer.from(basicToken, "base64")
    .toString()
    .split(":");

  if (!tokenUserName || !tokenPassword) {
    console.log("test3");
    return res.status(401).json({ error: "Unauthorized request" });
  }
  console.log(tokenUserName);
  req.app
    .get("db")("users")
    .where({ user_name: tokenUserName })
    .first()
    .then(user => {
      if (!user) {
        console.log("test4");
        return res.status(401).json({ error: "Unauthorized request" });
      }
      console.log("test5");
      return AuthService.comparePasswords(tokenPassword, user.password).then(
        passwordsMatch => {
          if (!passwordsMatch) {
            console.log("test6");
            return res.status(401).json({ error: "Unauthorized request" });
          }
          req.user = user;
          next();
        }
      );
    })
    .catch(next);*/
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

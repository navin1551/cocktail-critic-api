const express = require("express");
const UserService = require("./user-service");

const userRouter = express.Router();
const path = require("path");
const jsonParser = express.json();

userRouter.post("/", jsonParser, (req, res, next) => {
  const { first_name, last_name, email, password, user_name } = req.body;

  for (const field of [
    "first_name",
    "last_name",
    "email",
    "user_name",
    "password"
  ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in required field`
      });

  const passwordError = UserService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UserService.hasUserWithUserName(req.app.get("db"), user_name)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: "Username already taken" });

      return UserService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          first_name,
          last_name,
          email,
          user_name,
          password: hashedPassword
        };

        return UserService.insertUser(req.app.get("db"), newUser).then(user => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(UserService.serializeUser(user));
        });
      });
    })
    .catch(next);
});

module.exports = userRouter;

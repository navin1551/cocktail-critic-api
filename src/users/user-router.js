const express = require("express");
const path = require("path");
const UserService = require("./user-service");
const xss = require("xss");

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
  id: user.id,
  first_name: xss(user.first_name),
  last_name: xss(user.last_name),
  email: xss(user.email)
});

userRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    UserService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users);
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { first_name, last_name, email, user_name, password } = req.body;
    const newUser = { first_name, last_name, email, user_name, password };
    UserService.insertUser(knexInstance, newUser)
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

userRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;

    UserService.getById(knexInstance, id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeUser(res.user));
  })

  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;

    UserService.deleteUser(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { first_name, last_name, email, user_name, password } = req.body;
    const userToUpdate = { first_name, last_name, email, user_name, password };
    UserService.updateUser(knexInstance, req.params.id, userToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = userRouter;

const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { USER_TABLE } = require("../config");

router.post("/register", (request, response) => {
  const { name, role, email, password, phoneno } = request.body;
  

  const statement = `INSERT INTO ${USER_TABLE}
    (name, role, email, password , phoneno) VALUES(?,?,?,?,?)`;

  pool.execute(
    statement,
    [name, role, email, password, phoneno],
    (err, result) => {
      if (err) response.send(utils.createError(err.message));
      else response.send(utils.createSuccess("registered successfully..."));
    }
  );
});

router.post("/login", (request, response) => {
  const { email, password } = request.body;

  const statement = `SELECT 
        name, role, email, password , phoneno
        FROM ${USER_TABLE}
        WHERE email =? AND password =?`;

  pool.execute(statement, [email, password], (err, users) => {
    if (err) response.send(utils.createError(err));
    else {
      if (users.length == 0) response.send(utils.createError("No user found"));
      else {
        const { name, role, email, password, phoneno } = users[0];

        response.send(
          utils.createSuccess({
            name,
            role,
            email,
            password,
            phoneno,
          })
        );
      }
    }
  });
});

router.get("/user/:id", (request, response) => {
  const userId = request.params.id;

  const statement = `SELECT name, email, phoneno FROM ${USER_TABLE} WHERE id = ?`;

  pool.execute(statement, [userId], (err, users) => {
    if (err) response.send(utils.createError(err));
    else {
      if (users.length === 0) response.send(utils.createError("User not found"));
      else {
        const { name, email, phoneno } = users[0];
        response.send(
          utils.createSuccess({
            name,
            email,
            phoneno,
          })
        );
      }
    }
  });
});

router.put("/user/:id", (request, response) => {
  const userId = request.params.id;
  const { name, email, phoneno, password } = request.body;

  const statement = `UPDATE ${USER_TABLE}
    SET name = ?, email = ?, phoneno = ?, password = ?
    WHERE id = ?`;

  pool.execute(
    statement,
    [name, email, phoneno, password, userId],
    (err, result) => {
      if (err) response.send(utils.createError(err.message));
      else {
        if (result.affectedRows === 0) {
          response.send(utils.createError("User not found or no changes made"));
        } else {
          response.send(utils.createSuccess("Profile updated successfully"));
        }
      }
    }
  );
});

module.exports = router;

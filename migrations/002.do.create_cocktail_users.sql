CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  password TEXT NOT NULL
);

ALTER TABLE reviews
  ADD COLUMN user_id
    INTEGER REFERENCES users(id);
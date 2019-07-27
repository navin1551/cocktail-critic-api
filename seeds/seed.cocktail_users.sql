BEGIN;

TRUNCATE
  users
RESTART IDENTITY CASCADE;
 
INSERT INTO users (first_name, last_name, email, user_name, password)
VALUES
('Bob', 'Bobbo', 'bob@bob.com', 'bobboroo1', '$2a$12$z/hTINuBzlRD52yo6TY0ZuCfD6QoozaMvG1fWM9fA3OryQmCzscXG'),
('Rob', 'Robbo', 'rob@rob.com', 'robboroo1', '$2a$12$SMpXl87VnGkjlSCh9./.tuYByYZBhBJHEYt0Zc0tLatg33xVcirTq'),
('Jan', 'Janno', 'jan@jan.com', 'jannoroo1', '$2a$12$uUuVADn7jzY6we6Fjuk3PuNzpSxwbhkfgyt7ynYc2bXtx2u6MHMuO'),
('Sam', 'Sammo', 'sam@sam.com', 'sammorroo1', '$2a$12$z5XD98AfA0KljyVSdFOiO.lZtptiRHJablGg7K7GD/.TEWkjhKlb2'),
('Kumar','Kumarroo', 'kumar@kumar.com', 'kumarroo1', '$2a$12$Y0Z.8CKGBXI8XWcE9vx5Q.5lF9JgUw9O4drYxY4iGGka4E90COG5a');
COMMIT;
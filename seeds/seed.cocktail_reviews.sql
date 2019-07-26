BEGIN;

TRUNCATE 
reviews
RESTART IDENTITY CASCADE;


INSERT INTO reviews (name, image, comment, rating)
VALUES
('drink 1', 'https://www.thecocktaildb.com/images/media/drink/vsrupw1472405732.jpg', 'Comment 1', 1),
('drink 2', 'https://www.thecocktaildb.com/images/media/drink/vsrupw1472405732.jpg', 'Comment 2', 2),
('drink 3', 'https://www.thecocktaildb.com/images/media/drink/vsrupw1472405732.jpg', 'Comment 3', 3),
('drink 4', 'https://www.thecocktaildb.com/images/media/drink/vsrupw1472405732.jpg', 'Comment 4', 4),
('drink 5', 'https://www.thecocktaildb.com/images/media/drink/vsrupw1472405732.jpg', 'Comment 5', 5);

COMMIT;
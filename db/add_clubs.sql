INSERT INTO Clubs (Club_ID, Club_Name, Club_Registration, Club_Category)
VALUES
(1, 'Anime Club', '12345678', 'Culture'),
(2, 'Comics Club', '14839207', 'Culture'),
(3, 'Kpop Club', '19874536', 'Culture'),
(4, 'Dance Club', '18430295', 'Arts'),
(5, 'Painting Club', '27394850', 'Arts'),
(6, 'Music Club', '20647391', 'Arts'),
(7, 'Computer Science Club', '38475091', 'Faculty'),
(8, 'Maths Club', '67493015', 'Faculty'),
(9, 'English Club', '95178203', 'Faculty'),
(10, 'Basketball Club', '56819237', 'Sports'),
(11, 'Cricket Club', '72940518', 'Sports'),
(12, 'Football Society', '15927384', 'Sports');


UPDATE Clubs
SET Club_Link =
    CASE
        WHEN Club_Name = 'Anime Club' THEN 'anime.html'
        WHEN Club_Name = 'Comics Club' THEN 'comics.html'
        WHEN Club_Name = 'Kpop Club' THEN 'kpop.html'
        WHEN Club_Name = 'Dance Club' THEN 'dance.html'
        WHEN Club_Name = 'Painting Club' THEN 'painting.html'
        WHEN Club_Name = 'Music Club' THEN 'music.html'
        WHEN Club_Name = 'Computer Science Club' THEN 'compsciclub.html'
        WHEN Club_Name = 'Maths Club' THEN 'mathsclub.html'
        WHEN Club_Name = 'English Club' THEN 'englishclub.html'
        WHEN Club_Name = 'Basketball Club' THEN 'basketball.html'
        WHEN Club_Name = 'Cricket Club' THEN 'cricket.html'
        WHEN Club_Name = 'Football Society' THEN 'football.html'
    END;

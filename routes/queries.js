const populateUsersQuery = `
INSERT INTO Users (User_Id, User_FirstName, User_LastName, User_Password, User_Privileges, User_PhoneNumber, User_Email, Email_Notification, Logged_in, User_Clubs, Clubs_Managed)
VALUES
('a1939503', 'John', 'Doe', 'password123', 'user', '1234567890', 'johndoe@example.com', 1, 0, NULL, NULL),
('a1403854', 'Jane', 'Doe', 'password456', 'user', '9876543210', 'janedoe@example.com', 1, 0, NULL, NULL),
('a1450184', 'Jim', 'Doe', 'password789', 'user', '5555555555', 'jimdoe@example.com', 1, 0, NULL, NULL);
`;

module.exports = {
  populateUsersQuery
};

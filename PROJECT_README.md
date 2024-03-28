# HOW TO RUN THE WEB APPLICATION

## Step by step on how to start our group UG028 web app:

- Start the mysql server using 'service mysql start'
- Type 'mysql' into terminal
- Use the database provided by typing the following in order into terminal:
- 'source db/database.sql'
- 'source db/add_users.sql'
- 'source db/add_clubs.sql'
- 'source db/add_events.sql'
- 'source db/add_posts.sql'
- 'source db/add_participants.sql'
- 'source db/user_clubs.sql'
- 'source db/add_managers.sql'
- Start the express server with 'npm start'
- Using your preferred browser, paste this link into the address bar to get started:
- 'http://localhost:8080/main.html'

## Functionalities in the web includes but not limited to:
- Signup , login , logout - (Login may not work on certain browsers. Firefox preferred, and please use dev tool to make breakpoint to sign in at line 64 login.js. Tutor has advised that caching will commonly prevent it's smooth function.)
- navigate through clubs, join clubs and see club's related events and posts
- create events and posts for club managers
- website admin casn manage uers and clubs

Thank you


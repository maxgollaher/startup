# Climber's Crag

## Description Deliverable

### Elevator Pitch

It's a hot fall afternoon, and unfortunately, you and your friends got into an argument while rock climbing over who was the best climber. Well, don't worry, because with Climber's Crag, you can log your climbs and compare your stats with a friend! Now you can **PROVE** to your friend that you are a better climber.

### Key Features

- Secure login using HTTPS
- Ability to log information about different climbs (i.e. grade, flash/on-site/redpoint, date, location data)
- Uses Google Maps to collect and store location data
- Displays both personal data in the form of logged climbs and global leaderboards with user statistics.
- User can edit and delete logged climbs after they are created.
- Leaderboards can be focused/sorted to view stats in an ascending/descending rank.

### Technologies

- **HTML:** Uses HTML to structure the webpage. There will be a login page, a page to collect data from the user, and a page to display different statistics.
- **CSS:** For general styling, working with HTML.
- **JavaScript:** For login and displaying statistics.
- **Authentication:** Register and login users. Storing user information in a secure database.
- **Database data:** User data will be stored in the database, such as climbs logged, types of climbs, etc.
- **WebSocket data:** WebSockets, such as GoogleMaps, will be used to collect information like the location of logged climbs. Leaderboards will also update in realtime when users input new data.

### Sketches

Home page:
![home page](images/home-page.png)

Login popout:
![login popout](images/login.png)

Page to add climbing information:
![add climb page](images/add-climb.png)

Leaderboard page:
![leaderboard page](images/leaderboards.png)
Note: there will be a user page that is very similar to the leaderboard page, except the table will be populated with the specific user's data.




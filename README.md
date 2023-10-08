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
- **WebSocket data:** WebSockets, such as GoogleMaps, will be used to collect information like the location of logged climbs. Leaderboards will also update in real time when users input new data.

### Sketches

Home page:
![home page](images/home-page.png)

Login popout:
![login popout](images/login.png)

Page to add climbing information:
![add climb page](images/add-climb.png)

Leaderboard page:
![leaderboard page](images/leaderboards.png)
Note: there will be a user page very similar to the leaderboard page, except the table will be populated with the specific user's data.

## HTML Deliverable

This update created an HTML frame to start the website.

- [x] **HTML pages** - There are four main HTML pages, including a home/login page, profile, leaderboards, and a page to add climb data.
- [x] **Links** - There are navigation links that link to the separate pages, including a temporary link to a registration form. This will eventually be replaced with a pop-up form.
- [x] **Text** - There are titles on the different pages and text to help describe data placeholders.
- [x] **Images** - There is a logo image, more images will be added later in the CSS deliverable as background images. 
- [x] **Login** - Input box and submit button for login. There is also a placeholder for a register form as well. All login/form buttons currently link to different points on the website (i.e. login links to `profile.html` and register links to `index.html` to login.)
- [x] **Database** - Table placeholders on `profile.html` and `leaderboards.html` represent where the database will be shown.
- [x] **WebSocket** - There is an image placeholder on `add-ascent.html` to represent communication with Google Maps to collect location data on entered climbs.

## CSS deliverable

This update added CSS and Bootstrap styles to the website.

- [x] **Header, footer, and main content body** - Each page has a header and main content body. The main index.html is the only page with a footer because of styling choices.
- [x] **Navigation elements** - Each page has a navbar that links to the other pages. The add-ascent page is accessed through a button on the profile page.
- [x] **Responsive to window resizing** - All pages respond to window sizing, formatting the grids correctly. The background also responds to the size of the content, filling the whole screen.
- [x] **Application elements** - Whitespace is utilized to prevent the page from feeling crowded.
- [x] **Application text content** - Fonts are consistent throughtout the site.
- [x] **Application images** - Included a favicon for the icon in each page title. Each page also has a background image that responds to the size of the website.

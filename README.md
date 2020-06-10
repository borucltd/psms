# MEAMs app (Music Evoked Autobiographical Memories)

[deployed app](https://murmuring-lake-05413.herokuapp.com/) </br>
[presentation slide deck](https://www.canva.com/design/DAD-q-PNPJo/2qjmANGNy_sxNbHO4pC6_A/view?utm_content=DAD-q-PNPJo&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink)

## Description

Based on the popularity of journaling and scrapbooking, this app is designed for the Millennial user who lives their life through music as opposed to words or imagery. It is akin to a diary format for users, giving them the ability to document their daily experiences through playlists. It’s the modern day version of a mixtape. </br>
Application which lets you save songs depends on your daily mood. It uses your personal Spotify account to select “mood-random” songs. The algorithm will be based on mappings pre-defined in the database.  Users will have personal playlists which they can share with other users. 

## User Flow

* Application that utilise Spotify API to add tracks or songs that a user choose. 
* A user will be able to select several randomly choosen playlists that are already available inside Spotify. 
* Next, it will give the user several randomised tracks inside the selected playlists. 
* User then will bable to save the songs into their personal database.
* In this application there are several node modules that are being used, such as: sequelize, axios, express, express-handelbars, and passport. 
* For the front-end of the app, bootstrap library is utilised.


## Build Tech

* Spotify API
* MySQl
* Node dependencies; express, express-handlebars, sequelizer, passport.js, passport-local, MySQl2, Bcryptjs, express-sessions
* Front-End; Bootstrap 4, handlebars templating
* Protecting API key; dotenv
* Deployment; Heroku

## Deployment

* via Heroku: [deployed app](https://murmuring-lake-05413.herokuapp.com/)

## Screenshots of the app

User Login: </br>
![Login Page](https://github.com/borucltd/psms/blob/master/public/assets/img/MEAMs-login.png)

User Profile Page: </br>
![Profile Page](https://github.com/borucltd/psms/blob/master/public/assets/img/MEAMs-landing.png)

Search Spotify Curated Playlists: </br>
![Search Page](https://github.com/borucltd/psms/blob/master/public/assets/img/MEAMs-search-playlist.png)

Saved track searches: </br>
![User Saved tracks](https://github.com/borucltd/psms/blob/master/public/assets/img/MEAMs-user-tracks.png)

MEAMs App Landing Page: </br>
![Landing Page](https://github.com/borucltd/psms/blob/master/public/assets/img/MEAMs-splash-page.png)

## Future Developments

* create an open source project and get users to interact with it
* our Instagram account for the MEAMS app, so people can follow the latest update: [follow us <3](https://www.instagram.com/meams_app/)

## References

- The following are the references for some background reseach and for how the application title are choosen:
* [Music-Evoked Emotions—Current Studies journal article](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5705548/)
* [Music-evoked autobiographical memories in everyday life journal article](https://journals.sagepub.com/doi/full/10.1177/0305735619888803)

- Bootstrap 4 starter template files:
* [Bootstrap landing page template](https://startbootstrap.com/themes/new-age/)
* [Bootstrap code snippets](https://startbootstrap.com/snippets/)
* [Get Bootstrap Official templates](https://getbootstrap.com/docs/4.4/examples/)

- For the application OAuth 2.0, it is based on the following github repository:
* [JMPerez GitHub](https://github.com/JMPerez/passport-spotify)

## Authors

&copy; Copyright by Peculiar Penguins Enterprise (Mariuz, Nicole, Matthew, Astrid)

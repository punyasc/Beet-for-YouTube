# Beet for YouTube
A simple web app built to help you find song instrumentals on YouTube

![BeetImage](https://github.com/punyasc/Beet-for-YouTube/raw/master/screenshot.png)

## Setup
* Press the Log In button at the top right corner
* Create an account using an email and password (this creates an account using *Google Firebase Auth*)
* Your Beet account is now ready and will keep a log of instrumentals you've come across

## Usage
* Enter the name of an artist whose instrumentals' type you're trying to find
* Beet will use the *YouTube Data API* to suggest new instrumentals that fit your search criteria
* Go to `/history/userid` to see your previously-viewed instrumentals

## Underlying Technology
* *Google Firebase Auth* for user login/authentication
* *Google Firebase Realtime Database* for user and internal data storage
* *YouTube Data API* for querying YouTube
* *YouTube IFrame API* for playing YouTube videos
* *AngularJS* for displaying and controlling views

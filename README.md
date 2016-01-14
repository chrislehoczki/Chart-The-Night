# Chart the Night

## A nightlife coordination app built with Express, MongoDB, ReactJS and Foursquare API.

## Overview

Search your current area for local bars, then add yourself to that bar for the evening. You can see which bars
you have added and which you would still like to go to. Each bar has a grand total of visitors for that evening.

Only logged in users can add themselves to bars but anyone can search and see visitors for the bar for that evening.

Database schemas structured so that multiple date queries could be made for each bar and lists of users for a bar could be generated.

## Technologies

NodeJS with Express middleware, Mongoose, PassportJS for authentication, and ReactJS front end.

Makes use of Foursquare API to collect bar data.

# My List
You are enhancing your OTT platform to include a new feature called "My List," which allows users to save their favourite movies and TV shows to a personalised list. This feature requires backend services for managing the user's list, including adding, removing, and listing saved item

## Setup

- Clone the repository
- Install node.js
- Install the docker from https://docs.docker.com/desktop/install/
- After go to the docker folder in code
- Run docker compose up -d
- cd .\.
- npm install -g typescript 
- npm start
- http://localhost:3000/api-docs/ for swagger doc
- npm test ( for testing of route using mocha and chai)

## Explaination
Get route is optimized by the most accessed content will be saved in the redis cache for 1 hour if same content is present in the redis then no need to fetch in the db.

## Seeding of data
If you want the seed the intial data in db just enter the value in  src\seedData.ts


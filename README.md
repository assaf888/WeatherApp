# Assaf Cohen Home Assignment

## Q1

Created a Weather Monitor component that gives the current weather at JFK Airport.

### How to run:
* `cd ./Q1`
* `npm install`
* `npm start`
* https://localhost:3000


## Q2
Created a script that monitors given locations and alerts when the temperature difference in the next 15 minutes is greater than 2°C

### How to run:
* `cd ./Q2`
* `npm install`
* `npm start`

### How to run 24/7:
* `npm install pm2@latest -g`
* `cd ./Q2`
* `pm2 start ./weatherMonitoring`
* `pm2 logs` *in order to see the logs*

const express = require('express');
const app = express();
const apirouter = require('./apirouter')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const schedule = require('node-schedule')


//need to wait for database to seed before using the server
//need to have the server seed itself on a schedule
// require('./database/dbseed').seed()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', apirouter)

const PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

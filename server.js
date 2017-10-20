const express = require('express');
const app = express();
const apirouter = require('./apirouter')
const getVenueIdMappings = require('./wrapper').getVenueIdMappings
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

getVenueIdMappings()
.then(mappings => {
  const json = JSON.stringify(mappings, null, '\t');
  fs.writeFile('venue_id_mappings.json', json, () => {
    console.log('Finished making venue id mappings.')
  });
})
.catch(console.log)

app.use('/api', apirouter)

const PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
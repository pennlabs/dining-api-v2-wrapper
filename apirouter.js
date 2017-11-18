const router = require('express').Router();
const getVenueWeeklyMenu = require('./wrapper').getVenueWeeklyMenu;
const getVenueInformation = require('./wrapper').getVenueInformation;
const getAllVenues = require('./wrapper').getAllVenues;
const venueIdMappings = require('./venue_id_mappings');
const venueIds = Object.keys(venueIdMappings).map(k => venueIdMappings[k])

const all_menus = require('./all_menus')

router.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// specific venue information

//realtime query about venue status

router.get('/all_menus', (req,res) => {
  res.json(all_menus)
});

router.get('/weekly_menu/:venueId', (req,res) => {
  const venueId = req.params.venueId;
  res.json(all_menus[venueId])
});

router.get('/all_venues', (req,res) => {
  getAllVenues()
  .then(info => {
    res.send(info)
  })
  .catch(err => {
    res.status(500).send('Error retrieving venue information')
  })
});

router.get('/venue/:venueId', (req,res) => {
  const venueId = req.params.venueId && Number(req.params.venueId);
  if (!venueId) {
    return res.status(400).send('Error: no venueId provided');
  }
  const venueExists = venueIds.some(id => id === venueId);
  if (!venueExists) {
    return res.status(400).send('Venue does not exist')
  }
  getVenueInformation(venueId)
  .then(info => {
    res.send(info)
  })
  .catch(err => {
    res.status(500).send('Error in retrieving specific venue information')
  })
});

router.post('/get_venue_id', (req,res) => {
  const venueId = venueIdMappings[req.body.venue_name];
  if(!venueId) {
    return res.status(400).send('Invalid venue name provided');
  } else {
    return res.json({
      venueId
    })
  }
})

module.exports = router;
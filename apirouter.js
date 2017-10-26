const router = require('express').Router();
const getVenueWeeklyMenu = require('./wrapper').getVenueWeeklyMenu;
const venueIdMappings = require('./venue_id_mappings');

router.use((req,res,next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

router.get('/weekly_menu/:venueId', (req,res) => {
  const venueId = req.params.venueId;
  getVenueWeeklyMenu(venueId)
  .then(menu => {
    res.json(menu)
  })
  .catch(err => {
    res.status(500).send('Error retrieving menu information');
  });
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
const router = require('express').Router();
const DB = require('./database/db')

router.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


router.post('/menu_date_range', (req,res) => {
  const venueId = req.body.venueId;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  DB.dateRangeMenu(venueId, startDate, endDate)
  .then(meals => {
    res.json(meals);
  })
});

router.post('/daily_menu', (req,res) => {
  const venueId = Number(req.body.venueId);
  const date = req.body.date
  DB.getVenueMenuForDate(venueId, date)
  .then(meals => {
    res.json(meals)
  })
  .catch(err => {
    res.status(500).send("Serverside error")
  })
});


module.exports = router;
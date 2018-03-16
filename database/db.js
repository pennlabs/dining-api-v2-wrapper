const mongoose = require('./mongoose-connect')
const Venue = require('./models/Venue')
const Meal = require('./models/Meal')
const DateHours = require('./models/DateHours')
const _ = require('lodash');

module.exports.getVenueMenuForDate = function(venueId, date){
  return Venue.findOne({venueId})
  .then(venue => {
    if (!venue) {
      return res.status(400).send('Venue does not exist')
    }
    return Meal.find({venue: venue.id, date: date})
  })
}

function formatMealsObject(meals){
  const retObject = _.groupBy(meals, 'date');
  const dates = Object.keys(retObject);
  dates.forEach(date => {
    retObject[date] = _.groupBy(retObject[date], 'type')
    const types = Object.keys(retObject[date])
    types.forEach(type => {
      retObject[date][type] = _.groupBy(retObject[date][type], 'category')
      const categories = Object.keys(retObject[date][type])
      categories.forEach(category => {
        retObject[date][type][category] = retObject[date][type][category][0];
        if (retObject[date][type][category]) {
          retObject[date][type][category] = retObject[date][type][category]["meals"]
        }
      })
    })
  })
  return retObject
}

module.exports.dateRangeMenu = function(venueId, startDate, endDate){
  return Venue.findOne({venueId})
  .then(venue => {
    const venueDbId = venue.id;
    return Meal.find({
      venue: venueDbId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .then(meals => {
      //heirarchy: date -> mealtime -> category -> meals
      return formatMealsObject(meals)
    })
  })
}

module.exports.getAllMenus = function(){

}

module.exports.getVenueInfo = function(id){

}
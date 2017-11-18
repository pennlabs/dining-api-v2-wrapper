const fs = require('fs')
const async = require('async')
const getVenueIdMappings = require('../wrapper').getVenueIdMappings
const getVenueWeeklyMenu = require('../wrapper').getVenueWeeklyMenu
const getVenueInformation = require('../wrapper').getVenueInformation
const getAllVenues = require('../wrapper').getAllVenues;

const Venue = require('./models/Venue')
const DateHours = require('./models/DateHours')
const Meal = require('./models/Meal')

const _ = require('lodash')


function loadVenues() {
  return getAllVenues()
  .then((venues) => {
    const ids = Object.keys(venues);
    return Promise.all(ids.map(id => {
      const venue = venues[id]
      return new Venue({
        venueId: 593,
        name: venue.name,
        venueType: venue.venueType
      })
      .save()
      .then(venueObj => {
        return Promise.all(_.flatten(venue.dateHours.map((obj) => {
          const date = obj.date
          const meals = obj.meal
          return meals.map(meal => {
            new DateHours({
              date: new Date(date),
              type: meal.type, 
              open: meal.open,
              close: meal.close,
              venueId: venueObj.id
            }).save()
          })
        })))
      })
    }))
  })
}

function loadMeals(){
  const meals = require('../all_menus')
  const venueIds = Object.keys(meals)
  return Promise.all(_.flatten(venueIds.map(venueId => {
    return Venue.findOne({venueId : Number(venueId)})
    .then(venue => {
      if (!venue) {
        return Promise.resolve()
      }
      const mealsObj = meals[venueId]
      const dates = Object.keys(mealsObj)
      return _.flatten(dates.map(date => {
        dateMealsObj = mealsObj[date]
        const types = Object.keys(dateMealsObj)
        return types.map(type => { //type - breakfast lunch or dinner
          const mealObjects = dateMealsObj[type]
          const categories = Object.keys(mealObjects)
          return categories.map(category => {
            const items = mealObjects[category]
            const mealItems = items.map(item => {
              return {
                title: item.title ? item.title : '',
                description: item.description ? item.description : '',
                tags: item.tags ? item.tags : []
              }
            })
            return new Meal({
              date: date,
              type: type,
              venue: venue._id,
              meals: mealItems
            }).save()
          })
        })
      }))
    })
  })))
}

module.exports.loadMeals = loadMeals


module.exports.seed = function() {
  getVenueIdMappings()
  .then(mappings => {
    const json = JSON.stringify(mappings, null, '\t');
    return new Promise((res, rej) => {
      fs.writeFile('venue_id_mappings.json', json, () => {
        res(true)
      });
    })
  })
  .then(() => {
    const venueIdMappings = require('../venue_id_mappings');
    const venueIds = Object.keys(venueIdMappings).map(k => venueIdMappings[k])
    const masterObj = {}
    return new Promise((resolve,reject) => {
      async.eachSeries(venueIds, function(id, callback) {
        getVenueWeeklyMenu(id)
        .then(json => {
          console.log(id)
          masterObj[id] = json
          setTimeout(callback,1500)
        })
      }, function(err) {
        fs.writeFile('all_menus.json', JSON.stringify(masterObj), (er) => {
          resolve()
        })
      });
    })
  })
  .then(() => {
    return loadVenues()
  })
  .then(() => {
    return loadMeals()
  })
  .then(() => {
    console.log('COMPLETED')
  })
  .catch(console.log)
  
}


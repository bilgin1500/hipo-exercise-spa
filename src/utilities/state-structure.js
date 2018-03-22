/*
  The structure below is a representation of our application's state.
  It only holds the data gathered from Foursquare API and doesn't hold the
  components' states like isDropDownOpen or isMenuExpanded.

  There are 3 main properties. 
  "currentFetch" hold the data about the (last) active Foursquare fetch.
  "searches" array holds all the successful search requests done so far.
  "entities" are the Foursquare data in a normalized way. 
 */
export default {
  currentFetch: {
    query: 'STRING', // What was my last searched keyword
    near: 'STRING', // What was my last searched location
    searchId: 'UNIQUE_ID', // What is the current search result I'm looking at
    venueId: 'UNIQUE_ID', // What is the current venue I'm looking at
    isFetching: false, // One global flag for all the fetching
    message: {
      type: 0, // Success (0), Notifications (1), warnings (2) and errors (3)
      title: 'STRING',
      text: 'STRING'
    }
  },
  searches: {
    UNIQUE_ID: {
      id: 'UNIQUE_ID',
      query: 'STRING', // what we're looking for?
      near: 'STRING', // where we're looking for?
      location: 'STRING', // where Foursquare is looking
      createdAt: '2018-03-19 13:40', // when did we look
      results: ['UNIQUE_ID'] // what did we get
    }
  },
  entities: {
    // THE RELATIONAL DATABASE
    users: {
      UNIQUE_ID: {
        id: 'UNIQUE_ID',
        name: 'STRING',
        photoUrl: 'STRING'
      }
    },
    categories: {
      UNIQUE_ID: {
        id: 'UNIQUE_ID',
        name: 'STRING',
        iconUrl: 'STRING'
      }
    },
    venues: {
      UNIQUE_ID: {
        id: 'UNIQUE_ID',
        name: 'STRING',
        rating: 9.5,
        hereNow: 0,
        price: 0,
        address: 'STRING',
        phone: 'STRING',
        categories: ['UNIQUE_ID'],
        tipsOffset: 0,
        photos: [
          {
            userId: 'UNIQUE_ID',
            url: 'STRING',
            type: 'STRING'
          }
        ],
        tips: [
          {
            userId: 'UNIQUE_ID',
            text: 'STRING'
          }
        ]
      }
    }
  }
};

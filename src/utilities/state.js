/*
  The structure below is a representation of our application's state.
  It only holds the data gathered from Foursquare API and doesn't hold the
  components' states like isDropDownOpen or isMenuExpanded.

  There are 3 main properties. 
  "currentSearch" hold the data about the (last) active search.
  "searches" array holds all the successful search requests done so far.
  "entities" are the Foursquare data in a normalized way. 
 */
export default {
  currentSearch: {
    query: 'STRING',
    near: 'STRING',
    id: 'UNIQUE_ID',

    // Flag for loading state
    isFetching: false,

    // Success (0), Notifications (1), warnings (2) and errors (3)
    message: {
      type: 0,
      title: 'STRING',
      text: 'STRING'
    }
  },
  searches: {
    UNIQUE_ID: {
      id: 'UNIQUE_ID',
      query: 'STRING',
      near: 'STRING',
      createdAt: '2018-03-19 13:40',
      results: ['UNIQUE_ID']
    }
  },
  entities: {
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
        address: 'STRING',
        phone: 'STRING',
        categories: ['UNIQUE_ID'],
        photos: [
          {
            userId: 'UNIQUE_ID',
            url: 'STRING'
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

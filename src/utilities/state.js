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
    query: 'Hamburger',
    near: 'New York',

    // Will be set to true if API returns no results
    isEmpty: false,

    // Flag for loading state
    isFetching: false,

    // Something bad happened
    isError: false,
    errorMsg: ''
  },
  searches: [
    {
      id: 'sdadl23nbnb1562',
      query: 'Pizza',
      near: 'Kadıköy',
      createdAt: '2018-03-19 13:40',
      results: ['asdo29391823091']
    }
  ],
  entities: {
    users: [
      {
        id: 'k3j123g123hg',
        name: 'Firstname Lastname',
        photo: 'photo_url.png'
      }
    ],
    categories: [
      {
        id: 'ldkp3pilkdas2kj',
        name: 'Pizza Place',
        icon: 'icon_url.png'
      }
    ],
    venues: [
      {
        id: 'asdo29391823091',
        name: 'Starbucks',
        rating: 9.5,
        address: '',
        phone: '',
        categories: ['ldkp3pilkdas2kj'],
        photos: [
          {
            userId: 'k3j123g123hg',
            url: 'photo_url.png'
          }
        ],
        tips: [
          {
            userId: 'k3j123g123hg',
            text: 'Lorem ipsum dolat sit amet'
          }
        ]
      }
    ]
  }
};

module.exports = {
  title: 'Foursquared',
  titleSep: '<',

  webpack: {
    outputFolder: 'dist',
    outputAssetsFolder: 'assets',
    devServerPort: 8080
  },

  foursquare_api: {
    v: '20180317',
    url: 'https://api.foursquare.com/v2',
    group: '/venues',
    photo_size: 500, // 36, 100, 300, or 500
    cat_icon_size: 88, // 32, 44, 64, and 88
    client_id: '3QVH4AFOCCULOR4YWB2YTXLFOQ3ODBEDKNWMIGT0B0XAPDII',
    client_secret: '3HQA3KM5G3VZ02VS1XNNBVV1XF2ABSJWTSUSFDGA4HPLRUNK'
  },

  UI_delay: 1000,

  UI_messages: {
    error_title: 'Ooops! Something bad happened.',
    api_response_title: 'Foursquare says:',
    no_results_found_text: 'Sorry, no results found. Please try again.',
    no_match_found_text:
      'Sorry, no related search results found in the database. You should consider making a new search.',
    cleared_all: 'Localstorage and Redux store are all cleared.'
  }
};

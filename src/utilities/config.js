module.exports = {
  title: 'Foursquared',
  titleSep: ' — ',
  description:
    'A front-end exercise: Building a basic single page application using Foursquare API and latest web technologies.',

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
    limit: 10,
    client_id: '3QVH4AFOCCULOR4YWB2YTXLFOQ3ODBEDKNWMIGT0B0XAPDII',
    client_secret: '3HQA3KM5G3VZ02VS1XNNBVV1XF2ABSJWTSUSFDGA4HPLRUNK'
  },

  UI_delay: 1000,

  UI_placeholder_img:
    'http://via.placeholder.com/500x500/12195f/ff5f5f?text=:(%20No%20Image',

  UI_messages: {
    error_title: '🔥 Ooops! Something bad happened.',
    api_response_title: 'Foursquare says:',
    no_results_found_text: 'Sorry, no results found. Please try again.',
    no_match_found_text:
      'Sorry, no related search results found in the database. You should consider making a new search.',
    cleared_all: '🤘Perfect! 🙌'
  }
};

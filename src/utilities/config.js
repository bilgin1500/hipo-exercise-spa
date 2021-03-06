module.exports = {
  /*
   * Application related configuration
   */
  app: {
    title: 'Foursquared',
    title_sep: ' — ',
    description:
      'A front-end exercise: Building a basic single page application using Foursquare API and latest web technologies.',

    // Router endpoints
    endpoints: {
      search: 'search',
      venue: 'venue'
    }
  },

  /*
   * Webpack related configuration
   */
  webpack: {
    output_folder: 'dist',
    output_assets_folder: 'assets',
    dev_server_port: 8080
  },

  /*
   * Rest API related configuration
   */
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

  /*
   * UI related configuration
   */
  UI: {
    // After fetch request, for a better UX
    // we should delay the UI response a little bit
    delay: 1000,

    // In case the db doesn't return any image
    placeholder_img:
      'http://via.placeholder.com/500x500/12195f/ff5f5f?text=:(%20No%20Image',

    // All the UI messages
    messages: {
      error_title: '🔥 Ooops! Something bad happened.',
      api_response_title: 'Foursquare says:',
      no_results_found_text: 'Sorry, no results found. Please try again.',
      no_match_found_title: 'Ready to search?',
      no_match_found_text:
        'What about starting the day with a fresh cup of coffee?',
      cleared_all: '🤘Perfect! 🙌',
      no_venue_photo_title: 'Nothing to see',
      no_venue_photo_text:
        'It looks like nobody has taken any pictures of this place yet.',
      no_recent_search_text: 'All clear here.',
      zero_herenow_count_text: 'Nobody',
      no_tips_text: 'No tips left yet.',
      couldnt_fetch_venue_items_title: 'Sorry',
      couldnt_fetch_venue_items_text:
        "Due to an error couldn't get more photos and tips for this venue."
    },

    search_result_sep: ' in ' // Beer 'in' London
  }
};

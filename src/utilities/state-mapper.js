import { isUndefined, isNull, timeAgo, capitalize } from 'utilities/helpers';
import config from 'utilities/config';

/*
  These mappers when bound to the components via 'connect' method of 'react-redux', are mapping the current state to the component props.
 */

/**
 * Maps the current state to the search component on Search.js
 * @param  {object} state - Current store's state
 * @param  {object} ownProps - Current properties supplied to the component
 * @return {object} Final properties which will be injected into the component
 */
export const mapStateToHeaderSearch = (state, ownProps) => {
  // Only pass the related fetching info
  return {
    currentFetch: {
      isFetching: state.currentFetch.isFetching,
      near: state.currentFetch.near,
      query: state.currentFetch.query,
      message: state.currentFetch.message
    }
  };
};

/**
 * Maps the current state to the results page on MainResults.js
 * @param  {object} state - Current store's state
 * @param  {object} ownProps - Current properties supplied to the component
 * @return {object} Final properties which will be injected into the component
 */
export const mapStateToResults = (state, ownProps) => {
  const currentSearch = state.searches[ownProps.match.params.id];

  // Little helper to build a human readable search title
  const buildSearchTitle = (query, near, location, createdAt) => {
    const q = capitalize(query);
    const n = capitalize(near);
    const l = isUndefined(location) ? '' : capitalize(location);
    const t = isUndefined(createdAt) ? '' : timeAgo(createdAt);

    return {
      short: q + config.UI.search_result_sep + n,
      long: `You searched for ${q}${
        config.UI.search_result_sep
      }${n} ${t} and Foursquare's matching results are from the location '${l}'.`
    };
  };

  // Start with basics
  let props = {
    // Is there any fetching operation going on?
    currentFetch: {
      isFetching: state.currentFetch.isFetching,
      // Let's merge the current search info into this
      query: '',
      near: '',
      title: '',
      longTitle: '',
      results: [] // Venues
    },
    searches: {}
  };

  // Get all the previous searches for sidebar
  for (var key in state.searches) {
    if (state.searches.hasOwnProperty(key)) {
      props.searches = Object.assign(props.searches, {
        [key]: {
          id: key,
          title: buildSearchTitle(
            state.searches[key].query,
            state.searches[key].near
          ).short,
          longTitle: buildSearchTitle(
            state.searches[key].query,
            state.searches[key].near,
            state.searches[key].location,
            state.searches[key].createdAt
          ).long
        }
      });
    }
  }

  // Check if any search matches the url parameter.
  // If the search does not return a valid object we'll better
  // skip the 'currentFetch' and 'venues'
  //
  if (!isUndefined(currentSearch)) {
    // Set current searches info
    const builtTitle = buildSearchTitle(
      currentSearch.query,
      currentSearch.near,
      currentSearch.location,
      currentSearch.createdAt
    );
    props.currentFetch.query = currentSearch.query;
    props.currentFetch.near = currentSearch.near;
    props.currentFetch.title = builtTitle.short;
    props.currentFetch.longTitle = builtTitle.long;

    // Get the venue list of the current search result
    props.currentFetch.results = currentSearch.results.map(id => {
      const currentVenue = state.entities.venues[id];
      return {
        id: id,
        name: currentVenue.name,
        rating: currentVenue.rating,
        price: currentVenue.price,
        hereNow: currentVenue.hereNow,
        photo: currentVenue.photos.length
          ? currentVenue.photos.filter(photo => photo.type == 'venue').length
            ? currentVenue.photos.filter(photo => photo.type == 'venue')[0].url
            : currentVenue.photos[0].url
          : config.UI.placeholder_img
      };
    });
  }

  return props;
};

/**
 * Maps the current state to the venue detail page on MainVenueDetail.js
 * @param  {object} state - Current store's state
 * @param  {object} ownProps - Current properties supplied to the component
 * @return {object} Final properties which will be injected into the component
 */
export const mapStateToVenue = (state, ownProps) => {
  // Start with basics
  let props = {
    // Is there any fetching operation going on?
    currentFetch: {
      isFetching: state.currentFetch.isFetching,
      message: state.currentFetch.message
    },
    venue: {}
  };

  const currentVenue = state.entities.venues[ownProps.match.params.id];

  // Check if any venue matches the venue id
  if (!isUndefined(state.entities.venues[ownProps.match.params.id])) {
    props.venue = {
      id: currentVenue.id,
      name: currentVenue.name,
      rating: currentVenue.rating,
      address: currentVenue.address,
      phone: currentVenue.phone,
      price: currentVenue.price,
      hereNow: currentVenue.hereNow,
      categories: currentVenue.categories.length
        ? currentVenue.categories.map(id => {
            return {
              id: id,
              name: state.entities.categories[id].name,
              iconUrl: state.entities.categories[id].iconUrl
            };
          })
        : [],
      photos: currentVenue.photos.length
        ? currentVenue.photos.map(photo => {
            return {
              id: photo.id,
              src: photo.url,
              name:
                capitalize(photo.type) +
                ' photo from ' +
                state.entities.users[photo.userId].name,
              userName: state.entities.users[photo.userId].name,
              userPhoto: state.entities.users[photo.userId].photoUrl
            };
          })
        : [],
      tips: currentVenue.tips.length
        ? currentVenue.tips.map(tip => {
            return {
              id: tip.id,
              text: tip.text,
              userPhoto: state.entities.users[tip.userId].photoUrl,
              userName: state.entities.users[tip.userId].name
            };
          })
        : []
    };
  }

  return props;
};

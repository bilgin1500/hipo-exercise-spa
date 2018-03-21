import { isUndefined, timeAgo, capitalize } from 'utilities/helpers';
import config from 'utilities/config';

/**
 * Maps the state for the UI of the results page (components/MainResults.js)
 * @param  {object} state - Current store's state
 * @param  {object} ownProps - Current properties supplied to the component
 * @return {object} Final properties which will be injected into the component
 */
export const mapStateToResults = (state, ownProps) => {
  const isFetching = state.currentSearch.isFetching;
  const currentSearch = state.searches[ownProps.match.params.id];

  // Start with basics
  let props = {
    // Is there any search operation going on?
    isFetching: isFetching,
    searches: {}
  };

  // Check if any search matches the url parameter.
  // If the search does not return a valid object we'll better
  // skip the 'currentSearch' and 'venues'
  //
  if (isUndefined(currentSearch)) {
    props.currentSearch = {};
    props.venues = [];
  } else {
    // Get the current search's info
    (props.currentSearch = {
      id: currentSearch.id,
      query: currentSearch.query,
      near: currentSearch.near
    }),
      // Get the venue list of the current search result
      (props.venues = currentSearch.results.map(id => {
        const currentVenue = state.entities.venues[id];
        return {
          id: id,
          name: currentVenue.name,
          rating: currentVenue.rating,
          price: currentVenue.price,
          hereNow: currentVenue.hereNow,
          photo: currentVenue.photos.length
            ? currentVenue.photos.filter(photo => photo.type == 'venue').length
              ? currentVenue.photos.filter(photo => photo.type == 'venue')[0]
                  .url
              : currentVenue.photos[0].url
            : config.UI.placeholder_img
        };
      }));
  }

  // Get all the previous searches for sidebar
  for (var key in state.searches) {
    if (state.searches.hasOwnProperty(key)) {
      props.searches = Object.assign(props.searches, {
        [key]: {
          id: key,
          title:
            capitalize(state.searches[key].query) +
            config.UI.search_result_sep +
            capitalize(state.searches[key].near),
          timeAgo: timeAgo(state.searches[key].createdAt)
        }
      });
    }
  }

  return props;
};

/**
 * Maps the state for the UI of the venue detail page
 * (components/MainVenueDetail.js)
 * @param  {object} state - Current store's state
 * @param  {object} ownProps - Current properties supplied to the component
 * @return {object} Final properties which will be injected into the component
 */
export const mapStateToVenue = (state, ownProps) => {
  // Check if any search matches the url parameter, if not pass an empty object
  if (isUndefined(state.entities.venues[ownProps.match.params.id])) {
    return { venue: {} };
  }

  const currentVenue = state.entities.venues[ownProps.match.params.id];

  return {
    venue: {
      id: currentVenue.id,
      name: currentVenue.name,
      rating: currentVenue.rating,
      price: currentVenue.price,
      hereNow: currentVenue.hereNow,
      categories: [],
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
    }
  };
};

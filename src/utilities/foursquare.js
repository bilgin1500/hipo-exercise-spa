import querystring from 'querystring';
import { isUndefined } from 'utilities/helpers';
import config from 'utilities/config';

// @see https://developer.foursquare.com/docs/api/configuration/authentication#userless-auth
const buildCreds = () => {
  return {
    v: config.foursquare_api.v,
    client_id: config.foursquare_api.client_id,
    client_secret: config.foursquare_api.client_secret
  };
};

/**
 * This function builds the custom API urls to fetch the endpoints with custom
 * parameters
 * @param  {string} options.endpoint - categories,explore,search,photos,tips
 * @param  {object} options.params - endpoint specific query parameters
 * @param  {string} options.field - endpoint's field to fetch,
 * /VENUE_ID/photos etc.
 * @return {string} A valid Foursquare API url with credentials attached at
 * the end
 */
const buildAPIUrl = ({ endpoint, params, field }) => {
  let url = config.foursquare_api.url + config.foursquare_api.group + '/';

  if (!isUndefined(endpoint)) {
    url += endpoint;

    if (!isUndefined(field)) {
      url += '/' + field;
    }
  }

  url += '?' + querystring.stringify(buildCreds());

  if (!isUndefined(params)) {
    url += '&' + querystring.stringify(params);
  }

  return url;
};

/**
 * Wrapper for API requests
 * @param will be passed directly to buildAPIUrl method.
 * @return {promise} the request's promise
 */
export const fetchFS = params => {
  const urlToBeRequested = buildAPIUrl(params);
  return fetch(urlToBeRequested);
};

/**
 * Normalizer for Foursquare API response
 * @param {object} response - Full API response with meta and response properties
 * @return {object} Normalized data according to our store
 *
 * For API response, see: developer.foursquare.com/docs/api/venues/explore
 * For app's state shape, see: utilities/state.js file
 *
 * Below you can find all the extracted properties which we're going to use
 * in our app. The structure below has been extracted from the API response
 * for our request to '/explore' endpoint with parameters 'near' as string,
 * 'venuePhotos' as boolean and 'query' as string.
 *
 * |- meta
 *     |- requestId
 * |- response
 *     |- query
 *     |- headerLocation
 *     |- groups[0]
 *         |- items[0]
 *             |- tips[0]
 *                 |- text
 *                 |- user
 *                     |- id
 *                     |- firstName
 *                     |- lastName
 *                     |- photo
 *                         |- prefix
 *                         |- suffix
 *             |- venue
 *                 |- id
 *                 |- name
 *                 |- rating
 *                 |- photos
 *                     |- groups[0]
 *                         |- items[0]
 *                             |- prefix
 *                             |- suffix
 *                             |- user
 *                                 |- id
 *                                 |- firstName
 *                                 |- lastName
 *                                 |- photo
 *                                     |- prefix
 *                                     |- suffix
 *                 |- location
 *                     |- address
 *                 |- contact
 *                     |- formattedPhone
 *                 |- hereNow
 *                     |- count
 *                 |- categories[0]
 *                     |- id
 *                     |- name
 *                     |- icon
 *                         |- prefix
 *                         |- suffix
 */
export const normalize = response => {
  // Let's start with a structure similar to our app's final state.
  // Instead of the 'searches' array we're returning only one search and
  // there isn't any 'currentSearch' but the entities property is the same.
  // And a final difference is that the entities consist of duplicate entries.
  // In our final state there won't be any duplicate entry,
  const normalized = {
    search: {
      id: response.meta.requestId,
      query: response.response.query,
      near: response.response.headerLocation,
      results: []
    },
    entities: {
      users: {},
      venues: {},
      categories: {}
    }
  };

  // For the sake of the simplicity of this application
  // we won't loop all the response.groups and just use the first one
  if (
    response.response.groups.length &&
    response.response.groups[0].items.length
  ) {
    response.response.groups[0].items.forEach(item => {
      // Save the reference of this venue to the search results
      normalized.search.results.push(item.venue.id);

      // Create empty arrays to push the contents later
      let categories = [],
        photos = [],
        tips = [];

      /*
      Map all the tips to the empty array
      (entities.venues.UNIQUE_ID.tips)
       */
      if (!isUndefined(item.tips) && item.tips.length) {
        tips = item.tips.map(tip => {
          // Extract the tip's user to the user entity
          normalized.entities.users[tip.user.id] = {
            id: tip.user.id,
            name: tip.user.firstName + ' ' + tip.user.lastName,
            photoUrl:
              tip.user.photo.prefix +
              config.foursquare_api.photo_size +
              tip.user.photo.suffix
          };

          // Save the reference of the user and tip's text
          return {
            userId: tip.user.id,
            text: tip.text
          };
        });
      }

      /*
      Map all the photos to the empty array
      (entities.venues.UNIQUE_ID.photos)
       */
      if (
        item.venue.photos.groups.length &&
        item.venue.photos.groups[0].items.length
      ) {
        photos = item.venue.photos.groups[0].items.map(photo => {
          // Extract the photo's user to the user entity
          normalized.entities.users[photo.user.id] = {
            id: photo.user.id,
            name: photo.user.firstName + ' ' + photo.user.lastName,
            photoUrl:
              photo.prefix + config.foursquare_api.photo_size + photo.suffix
          };

          // Save the reference of the user and photo url
          return {
            userId: photo.user.id,
            url: photo.prefix + config.foursquare_api.photo_size + photo.suffix
          };
        });
      }

      /*
      Map all the categories to the empty array
      (entities.venues.UNIQUE_ID.categories)
       */
      if (item.venue.categories.length) {
        // Extract the category details to the categories entity
        categories = item.venue.categories.map(category => {
          normalized.entities.categories[category.id] = {
            id: category.id,
            name: category.name,
            iconUrl:
              category.icon.prefix +
              config.foursquare_api.cat_icon_size +
              category.icon.suffix
          };

          // Save the reference of the category id
          return category.id;
        });
      }

      // Add the venue to the venue entities
      normalized.entities.venues[item.venue.id] = {
        id: item.venue.id,
        name: item.venue.name,
        rating: item.venue.rating,
        address: item.venue.location.address,
        phone: item.venue.contact.phone,
        categories: categories,
        photos: photos,
        tips: tips
      };
    });
  }

  return normalized;
};

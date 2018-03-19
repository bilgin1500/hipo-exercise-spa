import uniqBy from 'lodash.uniqby';
import querystring from 'querystring';
import request from 'utilities/request';
import { isUndefined } from 'utilities/helpers';

// Base config object
const config = {
  api: {
    v: '20180317',
    url: 'https://api.foursquare.com/v2',
    group: '/venues',
    locale: 'en'
  },
  photo_size: 500, // 36, 100, 300, or 500
  cat_icon_size: 88, // 32, 44, 64, and 88
  client_id: '3QVH4AFOCCULOR4YWB2YTXLFOQ3ODBEDKNWMIGT0B0XAPDII',
  client_secret: '3HQA3KM5G3VZ02VS1XNNBVV1XF2ABSJWTSUSFDGA4HPLRUNK'
};

// @see https://developer.foursquare.com/docs/api/configuration/authentication#userless-auth
const buildCreds = () => {
  return {
    v: config.api.v,
    client_id: config.client_id,
    client_secret: config.client_secret
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
  let url = config.api.url + config.api.group + '/';

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
export const fetch = params => {
  const urlToBeRequested = buildAPIUrl(params);
  return request(urlToBeRequested);
};

/**
 * Normalizer for Foursquare API response
 * @param {object} response - Needed parts of the API response is shown below
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
      users: [],
      venues: [],
      categories: []
    }
  };

  // For the sake of the simplicity of this application
  // we won't loop all the response.groups and just use the first one
  response.response.groups[0].items.forEach(item => {
    normalized.search.results.push(item.venue.id);

    normalized.entities.venues.push({
      id: item.venue.id,
      name: item.venue.name,
      rating: item.venue.rating,
      address: item.venue.location.address,
      phone: item.venue.contact.phone,
      categories: item.venue.categories.map(category => {
        normalized.entities.categories.push({
          id: category.id,
          name: category.name,
          icon:
            category.icon.prefix + config.cat_icon_size + category.icon.suffix
        });
        return category.id;
      }),
      photos: item.venue.photos.groups[0].items.map(photo => {
        normalized.entities.users.push({
          id: photo.user.id,
          name: photo.user.firstName + ' ' + photo.user.lastName,
          photo: photo.prefix + config.photo_size + photo.suffix
        });

        return {
          userId: photo.user.id,
          url: photo.prefix + config.photo_size + photo.suffix
        };
      }),
      tips: item.tips.map(tip => {
        normalized.entities.users.push({
          id: tip.user.id,
          name: tip.user.firstName + ' ' + tip.user.lastName,
          photo:
            tip.user.photo.prefix + config.photo_size + tip.user.photo.suffix
        });

        return {
          userId: tip.user.id,
          text: tip.text
        };
      })
    });
  });

  normalized.entities.categories = uniqBy(normalized.entities.categories, 'id');
  normalized.entities.users = uniqBy(normalized.entities.users, 'id');

  return normalized;
};

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
 * Normalizer for Foursquare API. It takes the response and changes its shape.
 * @param {object} response - Full API response with meta and response properties
 * @return {object} Normalized object according to our store's shape
 *
 * Response:  developer.foursquare.com/docs/api/venues/explore
 * Store:     utilities/state.js
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
      Map all the photos from all the groups 
      (with group types like 'venue' or 'checkin')
      (entities.venues.UNIQUE_ID.photos)
       */
      if (item.venue.photos.groups.length) {
        item.venue.photos.groups.forEach(group => {
          if (group.count > 0) {
            group.items.forEach(photo => {
              // Extract the photo's user to the user entity
              normalized.entities.users[photo.user.id] = {
                id: photo.user.id,
                name: photo.user.firstName + ' ' + photo.user.lastName,
                photoUrl:
                  photo.prefix + config.foursquare_api.photo_size + photo.suffix
              };

              // Save the reference of the user and photo url
              photos.push({
                userId: photo.user.id,
                type: group.type,
                url:
                  photo.prefix + config.foursquare_api.photo_size + photo.suffix
              });
            });
          }
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
        rating: !isUndefined(item.venue.rating) && item.venue.rating,
        price:
          !isUndefined(item.venue.price) && !isUndefined(item.venue.price.tier)
            ? item.venue.price.tier
            : null,
        hereNow:
          !isUndefined(item.venue.hereNow) &&
          !isUndefined(item.venue.hereNow.count)
            ? item.venue.hereNow.count
            : null,
        address:
          !isUndefined(item.venue.location) &&
          !isUndefined(item.venue.location.address)
            ? item.venue.location.address
            : '',
        phone:
          !isUndefined(item.venue.contact) &&
          !isUndefined(item.venue.contact.phone)
            ? item.venue.contact.phone
            : '',
        categories: categories,
        photos: photos,
        tips: tips
      };
    });
  }

  return normalized;
};

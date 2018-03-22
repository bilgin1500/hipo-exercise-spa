import mergeWith from 'lodash.mergewith';
import { isUndefined, isEmptyObj, buildName } from 'utilities/helpers';
import config from 'utilities/config';

/*
  Below are the normalizers (converters) for the data returning from Foursquare API.
 */

/**
 * Normalizes the photos
 * @param  {array} items - 'Photos' array from the Foursquare API
 * @return {object} Returns all the photos as an array and the users as an object
 */
const normalizePhotos = items => {
  let photos = [];
  let users = {};

  items.forEach(photo => {
    users[photo.user.id] = {
      id: photo.user.id,
      name: buildName(photo.user.firstName, photo.user.lastName),
      photoUrl: photo.prefix + config.foursquare_api.photo_size + photo.suffix
    };

    photos.push({
      id: photo.id,
      type: 'venue',
      url: photo.prefix + config.foursquare_api.photo_size + photo.suffix,
      userId: photo.user.id
    });
  });

  return { photos, users };
};

/**
 * Normalizes the categories
 * @param  {array} items - 'Categories' array from the Foursquare API
 * @return {object} Returns all the categories as an object and the references (ids) as an array
 */
const normalizeCategories = items => {
  let categories = {};
  let ref = [];

  ref = items.map(category => {
    categories[category.id] = {
      id: category.id,
      name: category.name,
      iconUrl:
        category.icon.prefix +
        config.foursquare_api.cat_icon_size +
        category.icon.suffix
    };

    return category.id;
  });

  return { categories, ref };
};

/**
 * Normalizes the tips
 * @param  {array} items - 'Tips' array from the Foursquare API
 * @return {object} Returns all the tips as an array and the users as an object
 */
const normalizeTips = items => {
  let tips = [];
  let users = {};

  tips = items.map(tip => {
    users[tip.user.id] = {
      id: tip.user.id,
      name: buildName(tip.user.firstName, tip.user.lastName),
      photoUrl:
        tip.user.photo.prefix +
        config.foursquare_api.photo_size +
        tip.user.photo.suffix
    };

    return {
      id: tip.id,
      text: tip.text,
      userId: tip.user.id
    };
  });

  return { tips, users };
};

/**
 * 'Explore' normalizer
 * @public
 * @param {object} response - Full API response with meta and response properties
 * @return {object} Normalized object according to our store's shape
 *
 * Response:  developer.foursquare.com/docs/api/venues/explore
 * Store:     utilities/state-structure.js
 */
export const normalizeExplore = response => {
  // Let's start with a structure similar to our app's final state.
  // Instead of the 'searches' array we're returning only one search
  // which will be added to the 'searches' list and the 'entities'
  // property's structure is the same for easier merging.
  const normalized = {
    search: {
      id: response.meta.requestId,
      query: response.response.query,
      near: response.response.geocode.where,
      location: response.response.geocode.displayString,
      results: []
    },
    entities: {
      users: {},
      categories: {},
      venues: {}
    }
  };

  // For the sake of the simplicity of this application
  // we won't loop all the response.groups and just use the first one
  if (
    response.response.groups.length &&
    response.response.groups[0].items.length
  ) {
    let normalTips = { tips: [], users: {} };
    let normalPhotos = { photos: [], users: {} };
    let normalCats = { categories: {}, ref: [] };

    response.response.groups[0].items.forEach(item => {
      // Save the reference of this venue to the search results
      normalized.search.results.push(item.venue.id);

      // Normalize tips
      if (!isUndefined(item.tips) && item.tips.length) {
        normalTips = normalizeTips(item.tips);
      }

      // Normalize photos
      if (
        item.venue.photos.groups.length &&
        item.venue.photos.groups[0].items.length
      ) {
        normalPhotos = normalizePhotos(item.venue.photos.groups[0].items);
      }

      // Normalize categories
      if (item.venue.categories.length) {
        normalCats = normalizeCategories(item.venue.categories);
      }

      // Merge users and categories with the 'entities'
      const mergedUsers = mergeWith(normalPhotos.users, normalTips.users);
      normalized.entities.users = mergeWith(
        normalized.entities.users,
        mergedUsers
      );
      normalized.entities.categories = mergeWith(
        normalized.entities.categories,
        normalCats.categories
      );

      // Add the venue to the venue entities
      normalized.entities.venues[item.venue.id] = {
        id: item.venue.id,
        name: item.venue.name,
        rating: isUndefined(item.venue.rating) ? 0 : item.venue.rating,
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
        categories: normalCats.ref,
        photos: normalPhotos.photos,
        tipsOffset: 0,
        tipsCount:
          isUndefined(item.venue.stats) ||
          isEmptyObj(item.venue.stats) ||
          isUndefined(item.venue.stats.tipCount)
            ? 0
            : item.venue.stats.tipCount,
        tips: normalTips.tips
      };
    });
  }

  return normalized;
};

/**
 * 'Venue' normalizer
 * @public
 * @param {object} response - Full API response with meta and response
 * properties
 * @param {string} venueId - The Id of the venue. Unfortunately's not
 * available on the response :(
 * @param {number} tipsOffset - Tips' offset parameter
 * @return {object} Normalized object according to our store's shape
 * Response: developer.foursquare.com/docs/api/venues/photos
 * developer.foursquare.com/docs/api/venues/tips Store:
 * utilities/state-structure.js
 */
export const normalizeVenue = (response, venueId, tipsOffset) => {
  // The venue items (photos and tips) will be added to the current
  // venue entity and the 'entities' property's structure is the
  // same for easier merging.
  const normalized = {
    entities: {
      users: {},
      venues: {
        [venueId]: {
          photos: [],
          tips: []
        }
      }
    }
  };

  if (tipsOffset > 0)
    normalized.entities.venues[venueId].tipsOffset = tipsOffset;

  // Normalize photos
  if (
    !isUndefined(response.response.photos) &&
    response.response.photos.items.length
  ) {
    const normalPhotos = normalizePhotos(response.response.photos.items);
    normalized.entities.venues[venueId].photos = normalPhotos.photos;
    normalized.entities.users = normalPhotos.users;
  }

  // Normalize tips
  if (!isUndefined(response.response.tips) && response.response.tips.items) {
    const normalTips = normalizeTips(response.response.tips.items);
    normalized.entities.venues[venueId].tips = normalTips.tips;
    normalized.entities.users = normalTips.users;
  }

  return normalized;
};

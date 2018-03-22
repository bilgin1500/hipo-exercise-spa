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
 * This function builds the custom API urls. It glues all the parts together.
 * @param  {string} options.endpoint - categories,explore,search,photos,tips
 * @param  {object} options.params - endpoint specific query parameters
 * @param  {string} options.field - a field to fetch, like photos or tips
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

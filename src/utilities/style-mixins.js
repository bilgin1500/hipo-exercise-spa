import { css, keyframes } from 'styled-components';
import config from 'utilities/config';

// All styles are mobile-first so We define only bigger resolutions:
// mobile < tablet < laptop < desktop
const sizes = {
  tablet: 420,
  laptop: 750,
  desktop: 1170
};

/**
 * @see https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md#media-templates
 */
export const media = Object.keys(sizes).reduce((acc, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size:
  // @see https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  acc[label] = (...args) => css`
    @media (min-width: ${emSize}em) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});

/**
 * On truthy values the function parses the css
 * @param  {array} args - Argument array: css and prop
 * @return {string} css string
 */
export const isSearch = (...args) => {
  const [cssString, props] = [...args];
  if (props.endpoint == config.app.endpoints.search) {
    return cssString[1];
  }
};

/**
 * The ancient (but still useful) clear fix
 * @return {object} Clearfix with :after pseudo class
 */
export const clearfix = () => {
  return `
    &:after {
      content: '';
      display: table;
      clear: both;
    }
  `;
};

/**
 * Gotham font chooser
 * @param  {string} font - Type of the font: light(default), book, medium
 * @return {css} Returns the font-family and font-weight
 */
export const GothamFamily = type => {
  let fontFamily, fontWeight;

  switch (type) {
    case 'light':
    default:
      fontFamily =
        "'Gotham Extra Light', Helvetica Neue, Helvetica, Arial, sans-serif;";
      fontWeight = 200;
      break;
    case 'book':
      fontFamily =
        "'Gotham Book', Helvetica Neue, Helvetica, Arial, sans-serif;";
      fontWeight = 'normal';
      break;
    case 'medium':
      fontFamily =
        "'Gotham Medium', Helvetica Neue, Helvetica, Arial, sans-serif;";
      fontWeight = 500;
      break;
  }

  return `
    font-family: ${fontFamily};
    font-weight: ${fontWeight};
  `;
};

/*
  Keyframe animations with styled-components' 'keyframes' method.
 */

export const doubleBounce = keyframes`
  0%, 100% { transform: scale(0); }
  50% { transform: scale(1); }
`;

export const fadeIn = keyframes`
  from { opacity:0; }
  to { opacity:1; }
`;

export const fadeOut = keyframes`
  from { opacity:1; }
  to { opacity:0; }
`;

import { css } from 'styled-components';

// All styles are mobile-first. We'll define here bigger resolutions than mobile:
// mobile < tablet < laptop < desktop
const sizes = {
  tablet: 420,
  laptop: 750,
  desktop: 1170
};

// iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
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

export default media;

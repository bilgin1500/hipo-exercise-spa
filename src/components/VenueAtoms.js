import React from 'react';
import styled from 'styled-components';
import { Paragraph } from 'components/Atoms';
import { media } from 'utilities/style-mixins';
import { isUndefined, isNull } from 'utilities/helpers';
import personIcon from 'images/person';
import tagIcon from 'images/tag';

/**
 * Venue card
 * For displaying photos and meta
 */

export const VenueCard = styled.a`
  display: block;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  background-color: #12195f;
  float: left;
  text-decoration: none;
  margin-bottom: 4%;
  overflow: hidden;
  ${media.tablet`
    width: 48%;
    margin-right: 4%;
    &:nth-child(2n) {
      margin-right: 0;
    }
  `};
  ${media.laptop`
    max-width: 300px;
  `};
`;

/**
 * Card Image
 */

const Image = ({ className, src, alt }) => {
  return <img className={className} src={src} alt={alt} />;
};

export const VenueImage = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.5;
  object-fit: cover;
`;

/**
 * Icons in the meta wrapper
 */

const Icon = styled.img`
  display: inline-block;
  vertical-align: middle;
`;

/**
 * Here now count's paragraph
 */

const HereNowParagraph = Paragraph.extend`
  font-size: 0.75em;
  margin: 0 30px 0 5px;
  display: inline-block;
  vertical-align: middle;
`;

export const VenueHereNow = props => (
  <span>
    <Icon src={personIcon} alt="Here now count" />
    <HereNowParagraph gotham="medium">{props.count}</HereNowParagraph>
  </span>
);

/**
 * Price infographic bar
 */

const PriceWrapper = styled.div`
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  overflow: hidden;
  width: 60px;
  height: 3px;
  ${props => nthChild(props.range)};
`;

const nthChild = range => {
  let css = '';
  for (let i = 0; i < range; i++) {
    css += `
    > div:nth-child(${i + 1}) {
      opacity:1;
    }
  `;
  }
  return css;
};

const PriceBox = styled.div`
  display:inline-block;
  background-color: ${props => props.bgColor}
  height:3px;
  width: 25%;
  vertical-align: top;
  opacity:0;
`;

export const VenuePrice = props => {
  return (
    <span>
      {props.range > 0 && <Icon src={tagIcon} alt="Price range" />}
      {props.range > 0 && (
        <PriceWrapper range={props.range}>
          <PriceBox bgColor="#c9c5ff" />
          <PriceBox bgColor="#a59fee" />
          <PriceBox bgColor="#8b81ff" />
          <PriceBox bgColor="#685dea" />
        </PriceWrapper>
      )}
    </span>
  );
};

/**
 * Rating box
 */

const VenueRatingWrapper = styled.div`
  width: 60px;
  height: 60px;
  background-color: #776cee;
  transform: rotate(45deg);
  transform-origin: 50% 50%;
`;

const VenueRatingText = Paragraph.extend`
  font-size: 0.9375em;
  margin: 0;
  position: absolute;
  top: 10px;
  left: 10px;
  transform-origin: 50% 50%;
  transform: rotate(-45deg);
`;

export const VenueRating = props => {
  return (
    !isUndefined(props.rating) &&
    !isNull(props.rating) &&
    props.rating > 0 && (
      <VenueRatingWrapper className={props.className}>
        <VenueRatingText gotham="medium">{props.rating}</VenueRatingText>
      </VenueRatingWrapper>
    )
  );
};

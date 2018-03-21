import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { mapStateToVenue } from 'utilities/state-mapper';
import { Heading, Paragraph } from 'components/Atoms';
import { media } from 'utilities/style-mixins';
import config from 'utilities/config';
import { isUndefined, isNull } from 'utilities/helpers';

// All the icons for meta blocks
const icons = {
  person: require('images/person'),
  tag: require('images/tag'),
  location: require('images/location'),
  phone: require('images/phone')
};

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
 * Meta block for here now count, address, phone etc.
 */

const VenueMetaBlockParagraph = Paragraph.extend`
  font-size: 0.75em;
  margin: 0 30px 0 5px;
  display: inline-block;
  vertical-align: middle;
`;

export const VenueMetaBlock = props => (
  <span>
    <Icon src={icons[props.icon]} alt={props.alt} />
    <VenueMetaBlockParagraph gotham="medium">
      {props.text}
    </VenueMetaBlockParagraph>
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
      {props.range > 0 && <Icon src={icons.tag} alt="Price range" />}
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

/**
 * Venue header
 */

const VenueHeaderWrapper = styled.div`
  ${media.laptop`
    position: absolute:
    bottom:0
  `};
`;

const VenueHeaderCategoryWrapper = styled.div`
  border: 3px solid #fff;
  transform-origin: 50% 50%;
  transform: rotate(45deg);
  width: 150px;
  height: 150px;
  margin: -30px auto 30px auto;
  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -25px;
    margin-left: -25px;
    width: 60px;
    height: auto;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
  }
  ${media.laptop`
    position: absolute;
    top: 145px;
    left: 50%;
    margin:0 0 0 -200px;
  `};
`;

const VenueHeaderTitle = Heading.extend`
  font-size: 2em;
  ${media.laptop`
    font-size: 4em;
    margin-top: 40px;
  `};
  text-align: left;
  max-width: 1020px;
  margin: 0 auto;
  padding: 30px;
  box-sizing: border-box;
`;

const VenueHeaderMetaWrapper = styled.div`
  background-image: linear-gradient(
    95deg,
    rgba(30, 13, 180, 0.8),
    rgba(228, 71, 71, 0.8)
  );
`;

const VenueHeaderMetaInnerWrapper = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  padding: 20px 30px;
  box-sizing: border-box;
  position: relative;
`;

const VenueHeaderRating = styled(VenueRating)`
  position: absolute;
  margin-top:0
  right: 40px;
  top: -35px;
  height:70px;
  width:70px;
  > p {
    font-size: 1.125em;
    top: 22px;
    left: 22px;
  }
`;

const VenueMetaBlockWrapper = styled.div`
  margin-top: 10px;
  text-align: left;
  &:first-child {
    margin-top: 0;
  }
`;

export const VenueHeader = connect(mapStateToVenue)(({ venue }) => {
  return (
    <VenueHeaderWrapper>
      {venue.categories.length && (
        <VenueHeaderCategoryWrapper>
          <Icon
            src={venue.categories[0].iconUrl}
            alt={venue.categories[0].name}
          />
        </VenueHeaderCategoryWrapper>
      )}
      <VenueHeaderTitle>{venue.name}</VenueHeaderTitle>
      <VenueHeaderMetaWrapper>
        <VenueHeaderMetaInnerWrapper>
          {venue.address && (
            <VenueMetaBlockWrapper>
              <VenueMetaBlock
                text={venue.address}
                icon="location"
                alt="Address"
              />
            </VenueMetaBlockWrapper>
          )}
          {venue.phone && (
            <VenueMetaBlockWrapper>
              <VenueMetaBlock
                text={venue.phone}
                icon="phone"
                alt="Phone number"
              />
            </VenueMetaBlockWrapper>
          )}
          <VenueMetaBlockWrapper>
            <VenueMetaBlock
              text={
                venue.hereNow == 0
                  ? config.UI.messages.zero_herenow_count_text
                  : venue.hereNow
              }
              icon="person"
              alt="Here now count"
            />
            <VenuePrice range={venue.price} />
          </VenueMetaBlockWrapper>
          <VenueHeaderRating rating={venue.rating} />
        </VenueHeaderMetaInnerWrapper>
      </VenueHeaderMetaWrapper>
    </VenueHeaderWrapper>
  );
});

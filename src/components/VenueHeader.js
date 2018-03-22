import React from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { mapStateToVenue } from 'utilities/state-mapper';
import { Heading } from 'components/Atoms';
import { media } from 'utilities/style-mixins';
import config from 'utilities/config';
import { isEmptyObj, isUndefined } from 'utilities/helpers';
import {
  VenueRating,
  VenueMetaBlock,
  Icon,
  VenuePrice,
  propTypes,
  defaultProps
} from 'components/VenueAtoms';

/**
 * Venue header atoms
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
    margin-top: -30px;
    margin-left: -30px;
    width: 60px;
    height: auto;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
  }
  ${media.tablet`
    position: absolute;
    top: 145px;
    left: 50%;
    margin:0 0 0 -200px;
  `};
`;

const VenueHeaderTitle = Heading.extend`
  font-size: 2em;
  text-align: center;
  max-width: 1020px;
  margin: 0 auto;
  padding: 30px;
  padding-bottom: 70px;
  box-sizing: border-box;
  ${media.tablet`
    text-align: left;
    margin-top: 40px;
    padding-bottom: 30px;
    padding-right: 150px;
  `};
  ${media.laptop`
    font-size: 4em;
  `};
`;

const VenueHeaderMetaWrapper = styled.div`
  position: relative;
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
  position: relative;
  top: -35px;
  margin: 0 auto;
  height: 70px;
  width: 70px;
  margin-bottom: -20px;
  > p {
    font-size: 1.125em;
    top: 22px;
    left: 22px;
  }
  ${media.tablet`
    margin: 0;
    position: absolute;
    right: 40px;
  `};
`;

const VenueMetaBlockWrapper = styled.div`
  margin-top: 10px;
  text-align: left;
  span {
    display: inline-block;
  }
  span > div {
    vertical-align: top;
    margin-top: 7px;
    margin-left: 0;
  }
  span + span {
    margin-left: 30px;
  }
  p {
    margin: 0;
    text-align: left;
    display: inline-block;
    width: calc(100% - 25px);
    vertical-align: top;
    ${media.tablet`
      white-space: nowrap;
    `};
  }
  img {
    width: 12px;
    margin-top: 1px;
    margin-right: 10px;
    vertical-align: top;
  }
  &:first-child {
    margin-top: 0;
  }
`;

/**
 * The venue header component which gets and
 * parses the venue info on the header area.
 */
class VenueHeader extends React.Component {
  render() {
    return isEmptyObj(this.props.venue) || isUndefined(this.props.venue.id) ? (
      <Redirect to="/" />
    ) : (
      <VenueHeaderWrapper>
        {this.props.venue.categories.length && (
          <VenueHeaderCategoryWrapper>
            <Icon
              src={this.props.venue.categories[0].iconUrl}
              alt={this.props.venue.categories[0].name}
            />
          </VenueHeaderCategoryWrapper>
        )}
        <VenueHeaderTitle>{this.props.venue.name}</VenueHeaderTitle>
        <VenueHeaderMetaWrapper>
          <VenueHeaderRating rating={this.props.venue.rating} />
          <VenueHeaderMetaInnerWrapper>
            {this.props.venue.address && (
              <VenueMetaBlockWrapper>
                <VenueMetaBlock
                  text={this.props.venue.address}
                  icon="location"
                  alt="Address"
                />
              </VenueMetaBlockWrapper>
            )}
            {this.props.venue.phone && (
              <VenueMetaBlockWrapper>
                <VenueMetaBlock
                  text={this.props.venue.phone}
                  icon="phone"
                  alt="Phone number"
                />
              </VenueMetaBlockWrapper>
            )}
            <VenueMetaBlockWrapper>
              <VenueMetaBlock
                text={
                  this.props.venue.hereNow == 0
                    ? config.UI.messages.zero_herenow_count_text
                    : this.props.venue.hereNow
                }
                icon="person"
                alt="Here now count"
              />
              <VenuePrice range={this.props.venue.price} />
            </VenueMetaBlockWrapper>
          </VenueHeaderMetaInnerWrapper>
        </VenueHeaderMetaWrapper>
      </VenueHeaderWrapper>
    );
  }
}

// Proptypes validation
VenueHeader.propTypes = propTypes;

export default connect(mapStateToVenue)(VenueHeader);

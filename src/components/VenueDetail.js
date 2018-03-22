import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import { mapStateToVenue } from 'utilities/state-mapper';
import { fetchFoursquare } from 'utilities/actions';
import { media } from 'utilities/style-mixins';
import config from 'utilities/config';
import DocumentTitle from 'react-document-title';
import { VenueCard, VenueImage, propTypes } from 'components/VenueAtoms';
import {
  capitalize,
  buildTitle,
  isEmptyObj,
  isUndefined
} from 'utilities/helpers';
import {
  Paragraph,
  Heading,
  Link,
  Wrapper,
  Main,
  Sidebar,
  SidebarHeading,
  SidebarItem,
  MainMessage,
  Loader
} from 'components/Atoms';

/**
 * Sidebar atoms
 */

const VenueSidebar = styled(Sidebar)`
  background-color: #fff;
  box-shadow: 0 0 34px 0 rgba(115, 95, 255, 0.32);
  ${media.laptop`
    margin-top: -85px;
  `};
`;

const Avatar = styled.img`
  display: block;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  transform: rotate(-45deg);
  float: left;
`;

const TipWrapper = styled.div`
  float: right;
  width: calc(100% - 70px);
  padding-top: 10px;
`;

const TipUser = Heading.withComponent('h2').extend`
  font-size: 0.875em;
  color: #9b9b9b;
  text-align: left;
  word-wrap: break-word;
`;

const TipText = Paragraph.extend`
  font-size: 0.875em;
  color: #9b9b9b;
  text-align: left;
  margin-top: 15px;
  word-wrap: break-word;
`;

const MoreLink = Link.extend`
  display: block;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 20px;
  font-size: 0.6875em;
  cursor: ${props => (props.isFetching ? 'default' : 'pointer')};
  color: ${props => (props.isFetching ? '#ccc' : '#7a74d2')};
  &:hover {
    text-decoration: ${props => (props.isFetching ? 'none' : 'underline')};
  }
`;

/**
 * Venue meta atoms
 */

const MainLoader = Loader.extend`
  margin-bottom: 20px;
`;

const VenuePhotoCardWrapper = VenueCard.extend`
  &:hover > div {
    transform: translateY(0);
  }
`;

const VenuePhoto = VenueImage.extend`
  opacity: 1;
`;

const VenuePhotoUserWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 100px;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(18, 25, 95, 0.5);
  transform: translateY(100%);
  transition: transform 150ms ease-out;
`;

const VenuePhotoUsername = Heading.extend`
  font-size: 0.875em;
`;

const VenuePhotoAvatarWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px auto;
  transform: rotate(-45deg);
  transform-origin: 50% 50%;
  overflow: hidden;
`;

const VenuePhotoAvatarImg = styled.img`
  display: block;
  width: 90px;
  height: 90px;
  margin-top: -15px;
  margin-left: -15px;
  object-fit: cover;
  transform: rotate(45deg);
  transform-origin: 50% 50%;
`;

const VenuePhotoCard = props => (
  <VenuePhotoCardWrapper>
    <VenuePhotoUserWrapper>
      <VenuePhotoAvatarWrapper>
        <VenuePhotoAvatarImg src={props.userPhoto} alt={props.userName} />
      </VenuePhotoAvatarWrapper>
      <VenuePhotoUsername gotham="medium">{props.userName}</VenuePhotoUsername>
    </VenuePhotoUserWrapper>
    <VenuePhoto src={props.src} alt={props.name} />
  </VenuePhotoCardWrapper>
);

/**
 * Layout with left and right columns
 */

class VenueDetail extends React.Component {
  constructor() {
    super();
    this.getMoreTips = this.getMoreTips.bind(this);
  }

  // To request more tips from the server use this function
  getMoreTips(e) {
    e.preventDefault();
    const currOffset = this.props.venue.tipsOffset;
    const totalTips = this.props.venue.tipsCount;

    // Check if there are still tips left on the server
    if (currOffset < totalTips && !this.props.currentFetch.isFetching) {
      this.props.dispatch(
        fetchFoursquare({
          endpoint: 'tips',
          venueId: this.props.venue.id,
          offset: currOffset + config.foursquare_api.limit
        })
      );
    }
  }

  // After page load request tips and photos from the server
  componentDidMount() {
    if (!isEmptyObj(this.props.venue) && !isUndefined(this.props.venue.id)) {
      this.props.dispatch(
        fetchFoursquare({
          endpoint: 'photos',
          venueId: this.props.venue.id
        })
      );
      this.props.dispatch(
        fetchFoursquare({
          endpoint: 'tips',
          venueId: this.props.venue.id
        })
      );
    }
  }

  render() {
    // Out of scope error :/
    return isEmptyObj(this.props.venue) || isUndefined(this.props.venue.id) ? (
      <Redirect to="/" />
    ) : (
      <DocumentTitle title={buildTitle(capitalize(this.props.venue.name))}>
        <Wrapper>
          <Main>
            {this.props.currentFetch.isFetching && <MainLoader color="#ccc" />}

            {!isUndefined(this.props.currentFetch.message) &&
              !isEmptyObj(this.props.currentFetch.message) && (
                <MainMessage
                  title={config.UI.messages.couldnt_fetch_venue_items_title}
                  text={config.UI.messages.couldnt_fetch_venue_items_text}
                />
              )}

            {this.props.venue.photos.length ? (
              this.props.venue.photos.map((photo, index) => (
                <VenuePhotoCard {...photo} key={photo.id} />
              ))
            ) : (
              <MainMessage
                title={config.UI.messages.no_venue_photo_title}
                text={config.UI.messages.no_venue_photo_text}
              />
            )}
          </Main>
          <VenueSidebar>
            <SidebarHeading gotham="medium">Tips</SidebarHeading>
            {this.props.currentFetch.isFetching && <MainLoader color="#ccc" />}

            {this.props.venue.tips.length ? (
              this.props.venue.tips.map(tip => (
                <SidebarItem key={tip.id}>
                  <Avatar src={tip.userPhoto} alt={tip.userName} />
                  <TipWrapper>
                    <TipUser gotham="medium">{tip.userName}</TipUser>
                    <TipText gotham="book">{tip.text}</TipText>
                  </TipWrapper>
                </SidebarItem>
              ))
            ) : (
              <Paragraph gotham="book" color="#999">
                {config.UI.messages.no_tips_text}
              </Paragraph>
            )}
            {this.props.venue.tipsOffset < this.props.venue.tipsCount && (
              <MoreLink
                onClick={this.getMoreTips}
                gotham="medium"
                href="/"
                isFetching={this.props.currentFetch.isFetching}
              >
                {this.props.currentFetch.isFetching
                  ? 'Loading more...'
                  : 'Get more tips'}
              </MoreLink>
            )}
          </VenueSidebar>
        </Wrapper>
      </DocumentTitle>
    );
  }
}

// Proptypes validation
VenueDetail.propTypes = propTypes;

export default connect(mapStateToVenue)(VenueDetail);

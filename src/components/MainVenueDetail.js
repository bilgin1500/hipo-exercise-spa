import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { mapStateToVenue } from 'utilities/state-mapper';
import { capitalize, buildTitle } from 'utilities/helpers';
import config from 'utilities/config';
import DocumentTitle from 'react-document-title';
import {
  Paragraph,
  Heading,
  Wrapper,
  Main,
  Sidebar,
  SidebarHeading,
  SidebarItem,
  MainMessage
} from 'components/Atoms';
import {
  VenueCard,
  VenueHereNow,
  VenuePrice,
  VenueRating,
  VenueImage
} from 'components/VenueAtoms';

/**
 * Sidebar atoms
 */

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
`;

const TipText = Paragraph.extend`
  font-size: 0.875em;
  color: #9b9b9b;
  text-align: left;
  margin-top: 15px;
`;

/**
 * Venue meta atoms
 */

// Header

const VenueTitle = Heading.extend`
  font-size: 4em;
  text-align: left;
`;

const VenueRatingWrapper = styled(VenueRating)``;

// Photos

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
  <VenueCard>
    <VenuePhotoUserWrapper>
      <VenuePhotoAvatarWrapper>
        <VenuePhotoAvatarImg src={props.userPhoto} alt={props.userName} />
      </VenuePhotoAvatarWrapper>
      <VenuePhotoUsername gotham="medium">{props.userName}</VenuePhotoUsername>
    </VenuePhotoUserWrapper>
    <VenuePhoto src={props.src} alt={props.name} />
  </VenueCard>
);

/**
 * Layout
 */

const VenueDetail = props => {
  return (
    <DocumentTitle title={buildTitle(capitalize(props.venue.name))}>
      <Wrapper>
        <Main>
          {props.venue.photos.length ? (
            props.venue.photos.map((photo, index) => (
              <VenuePhotoCard {...photo} key={photo.id} />
            ))
          ) : (
            <MainMessage
              title={config.UI.messages.no_venue_photo_title}
              text={config.UI.messages.no_venue_photo_text}
            />
          )}
        </Main>
        <Sidebar>
          <SidebarHeading gotham="medium">Tips</SidebarHeading>
          {props.venue.tips.map(tip => (
            <SidebarItem key={tip.id}>
              <Avatar src={tip.userPhoto} alt={tip.userName} />
              <TipWrapper>
                <TipUser gotham="medium">{tip.userName}</TipUser>
                <TipText gotham="book">{tip.text}</TipText>
              </TipWrapper>
            </SidebarItem>
          ))}
        </Sidebar>
      </Wrapper>
    </DocumentTitle>
  );
};

export default connect(mapStateToVenue)(VenueDetail);

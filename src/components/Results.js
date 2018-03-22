import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { mapStateToResults } from 'utilities/state-mapper';
import DocumentTitle from 'react-document-title';
import {
  updateFetch,
  stopFetch,
  clearFetch,
  clearAll
} from 'utilities/actions';
import config from 'utilities/config';
import {
  capitalize,
  checkList,
  buildTitle,
  isEmptyObj
} from 'utilities/helpers';
import {
  Link,
  Paragraph,
  Heading,
  Button,
  Wrapper,
  Main,
  Loader,
  Sidebar,
  SidebarHeading,
  SidebarItem,
  MainMessage
} from 'components/Atoms';
import {
  VenueCard,
  VenueMetaBlock,
  VenuePrice,
  VenueRating,
  VenueImage
} from 'components/VenueAtoms';

/**
 * Sidebar atoms
 */

const SearchLink = SidebarItem.withComponent('a').extend`
  color: #9b9b9b;
  text-decoration: none;
  &:hover {
    text-decoration:underline;
  }
`;

const ClearAllButton = styled(Button)`
  display: block;
  box-shadow: none;
  margin: 0 auto;
  margin-top: 20px;
  background-color: #eee;
  transition: background-color 150ms, color 150ms;
  color: #9b9b9b;
  &:hover {
    color: #fff;
    background-color: #9b9b9b;
  }
`;

/**
 * Venue card atoms
 */

const VenueCardStyled = VenueCard.extend`
  transition: box-shadow 500ms ease-out;
  &:hover {
    box-shadow: 0 0 21px 0 rgba(0, 0, 0, 0.7);
  }
  &:hover img {
    transform: scale(1.1);
  }
`;

const VenueInfoWrapper = styled.div`
  position: absolute;
  height: auto;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 2;
`;

const VenueTitle = Heading.extend`
  font-size: 1.5625em;
  text-align: left;
  &:after {
    content: '';
    display: block;
    margin-top: 10px;
    border-radius: 3px;
    width: 48px;
    height: 2px;
    background-color: #c4c0ff;
  }
`;

const VenueMetaWrapper = styled.div`
  margin-top: 10px;
`;

const VenueRatingWrapper = styled(VenueRating)`
  position: absolute;
  right: -10px;
  bottom: -50px;
`;

const Venue = props => (
  <VenueCardStyled href={`#/venue/${props.id}`}>
    <VenueInfoWrapper>
      <VenueTitle gotham="book">{props.name}</VenueTitle>
      <VenueMetaWrapper>
        <VenueMetaBlock
          text={props.hereNow}
          icon="person"
          alt="Here now count"
        />
        <VenuePrice range={props.price} />
        <VenueRatingWrapper rating={props.rating} />
      </VenueMetaWrapper>
    </VenueInfoWrapper>
    <VenueImage src={props.photo} alt={props.name} />
  </VenueCardStyled>
);

/**
 * Results layout with left and right columns
 */

class Results extends React.Component {
  // Checks if current id from the pathname
  // exists in the searches
  checkParams() {
    const id = this.props.match.params.id;
    const searches = this.props.searches;
    return checkList(id, searches);
  }

  // Builds the document title
  buildTitle() {
    if (this.checkParams()) {
      return this.props.currentFetch.title;
    } else {
      return buildTitle(config.UI.messages.no_match_found_title);
    }
  }

  // Updates the store for current search info
  updateStoreForSearch(query, near, id) {
    this.props.dispatch(updateFetch(query, near, id));
    setTimeout(() => {
      this.props.dispatch(stopFetch());
    }, config.UI.delay);
  }

  componentDidMount() {
    this.updateStoreForSearch(
      this.props.currentFetch.query,
      this.props.currentFetch.near,
      this.props.currentFetch.id
    );
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match.params.id !== newProps.match.params.id) {
      this.updateStoreForSearch(
        newProps.currentFetch.query,
        newProps.currentFetch.near,
        newProps.currentFetch.id
      );
    }
  }

  // When unmounting clear the fetch info
  componentWillUnmount() {
    this.props.dispatch(clearFetch());
  }

  render() {
    return (
      <DocumentTitle title={this.buildTitle()}>
        <Wrapper>
          <Main>
            {!this.checkParams() && (
              <MainMessage
                title={config.UI.messages.no_match_found_title}
                text={config.UI.messages.no_match_found_text}
              />
            )}

            <Heading color="#4a4a4a">{this.props.currentFetch.title}</Heading>
            <Paragraph color="#666" gotham="book">
              {this.props.currentFetch.longTitle}
            </Paragraph>

            {this.props.currentFetch.isFetching ? (
              <Loader color="#ccc" />
            ) : (
              this.props.currentFetch.results.map(venue => (
                <Venue {...venue} key={venue.id} />
              ))
            )}
          </Main>
          <Sidebar>
            <SidebarHeading gotham="medium">Recent Searches</SidebarHeading>
            {!isEmptyObj(this.props.searches) ? (
              Object.keys(this.props.searches).map(id => (
                <SearchLink
                  key={id}
                  href={`#/${config.app.endpoints.search}/${id}`}
                  title={this.props.searches[id].longTitle}
                  gotham="medium"
                >
                  {this.props.searches[id].title}
                </SearchLink>
              ))
            ) : (
              <Paragraph gotham="book" color="#999">
                {config.UI.messages.no_recent_search_text}
              </Paragraph>
            )}
            <ClearAllButton
              onClick={e => {
                e.preventDefault();
                this.props.dispatch(clearAll());
              }}
            >
              Clear All
            </ClearAllButton>
          </Sidebar>
        </Wrapper>
      </DocumentTitle>
    );
  }
}

Results.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentFetch: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    near: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    longTitle: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired
  }),
  searches: PropTypes.object.isRequired
};

export default connect(mapStateToResults)(Results);

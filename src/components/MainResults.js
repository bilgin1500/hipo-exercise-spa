import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { mapStateToResults } from 'utilities/state-mapper';
import { updateSearch, stopSearch, clearSearch } from 'utilities/actions';
import config from 'utilities/config';
import DocumentTitle from 'react-document-title';
import ClearAllButton from 'components/ClearAllButton';
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
`;

/**
 * Venue card atoms
 */

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
  <VenueCard href={`#/venue/${props.id}`}>
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
  </VenueCard>
);

/**
 * Layout
 */

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  checkParams() {
    const id = this.props.match.params.id;
    const searches = this.props.searches;
    return checkList(id, searches);
  }

  getTitle() {
    if (this.checkParams()) {
      return buildTitle(
        capitalize(this.props.currentSearch.query) +
          config.UI.search_result_sep +
          capitalize(this.props.currentSearch.near)
      );
    } else {
      return buildTitle(config.UI.messages.no_match_found_title);
    }
  }

  updateStoreForSearch(query, near, id) {
    this.props.dispatch(updateSearch(query, near, id));
    setTimeout(() => {
      this.props.dispatch(stopSearch());
    }, config.UI.delay);
  }

  componentDidMount() {
    this.updateStoreForSearch(
      this.props.currentSearch.query,
      this.props.currentSearch.near,
      this.props.currentSearch.id
    );
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match.params.id !== newProps.match.params.id) {
      this.updateStoreForSearch(
        newProps.currentSearch.query,
        newProps.currentSearch.near,
        newProps.currentSearch.id
      );
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearSearch());
  }

  render() {
    return (
      <DocumentTitle title={this.getTitle()}>
        <Wrapper>
          <Main>
            {!this.checkParams() && (
              <MainMessage
                title={config.UI.messages.no_match_found_title}
                text={config.UI.messages.no_match_found_text}
              />
            )}

            {this.props.isFetching ? (
              <Loader color="#ccc" />
            ) : (
              this.props.venues.map(venue => (
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
                  title={`Searched ${this.props.searches[id].timeAgo}`}
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
            <ClearAllButton />
          </Sidebar>
        </Wrapper>
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToResults)(Results);

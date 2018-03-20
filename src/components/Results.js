import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { mapStateToResults } from 'utilities/actions';
import VenueCard from 'components/VenueCard';
import ClearAllButton from 'components/ClearAllButton';
import { Link, Paragraph, Heading } from 'components/Atoms';
import { clearfix, media } from 'utilities/style-mixins';

const Wrapper = styled.section`
  ${clearfix()};
  max-width: 1040px;
  padding: 40px;
  padding-bottom: 0;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Main = styled.main`
  ${clearfix()};
  float: left;
  width: 100%;
  ${media.laptop`
    width:60%;
  `};
`;

const Sidebar = styled.aside`
  float: right;
  width: 100%;
  padding: 30px;
  box-shadow: 0 0 34px 0 rgba(255, 95, 95, 0.32);
  box-sizing: border-box;
  ${media.laptop`
    width:35%;
  `};
`;

const SearchesHeading = Heading.extend`
  text-transform: uppercase;
  font-size: 1em;
  color: #4a4a4a;
  text-align: center;
  &:after {
    content: '';
    display: block;
    margin: 30px auto 20px auto;
    border-radius: 3px;
    width: 70px;
    height: 2px;
    background-color: #c4c0ff;
  }
`;

const SearchLink = Link.extend`
  display: block;
  text-align: center;
  padding: 20px 0;
  color: #9b9b9b;
  font-size: 0.875em;
  border-bottom: 1px solid #e4e4e4;
  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
`;

const Results = props => {
  return (
    <Wrapper>
      <Main>
        {props.venues.map(venue => <VenueCard {...venue} key={venue.id} />)}
      </Main>
      <Sidebar>
        <SearchesHeading gotham="medium">Recent Searches</SearchesHeading>
        {props.searches.map(search => (
          <SearchLink
            href={`#/search/${search.id}`}
            title={`Searched ${search.timeAgo}`}
            gotham="medium"
            key={search.id}
          >
            {search.title}
          </SearchLink>
        ))}
        <ClearAllButton />
      </Sidebar>
    </Wrapper>
  );
};

export default connect(mapStateToResults)(Results);

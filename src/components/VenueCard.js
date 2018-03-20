import React from 'react';
import styled from 'styled-components';
import { media, clearfix } from 'utilities/style-mixins';
import { Paragraph, Heading } from 'components/Atoms';
import personIcon from 'images/person';
import tagIcon from 'images/tag';

const VenueWrapper = styled.a`
  display: block;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  background-color: #12195f;
  float: left;
  text-decoration: none;
  margin-bottom: 4%;
  ${media.tablet`
    width: 48%;
    max-width: 300px;
    margin-right: 4%;
    &:nth-child(2n) {
      margin-right: 0;
    }
  `};
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
  margin: 0;
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

const Icon = styled.img`
  display: inline-block;
  vertical-align: middle;
`;

const HereNowParagraph = Paragraph.extend`
  font-size: 0.75em;
  margin: 0 30px 0 5px;
  display: inline-block;
  vertical-align: middle;
`;

const Image = ({ className, src, alt }) => {
  return <img className={className} src={src} alt={alt} />;
};

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

const PriceInfo = styled.div`
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

const PriceBox = styled.div`
  display:inline-block;
  background-color: ${props => props.bgColor}
  height:3px;
  width: 25%;
  vertical-align: top;
  opacity:0;
`;

const VenueImage = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.5;
  object-fit: cover;
`;

const VenueCard = props => (
  <VenueWrapper href={`#/venue/${props.id}`}>
    <VenueInfoWrapper>
      <VenueTitle gotham="book">{props.name}</VenueTitle>
      <VenueMetaWrapper>
        <Icon src={personIcon} alt="Here now count" />
        <HereNowParagraph gotham="medium">{props.hereNow}</HereNowParagraph>
        {props.price > 0 && <Icon src={tagIcon} alt="Price range" />}
        {props.price > 0 && (
          <PriceInfo range={props.price}>
            <PriceBox bgColor="#c9c5ff" />
            <PriceBox bgColor="#a59fee" />
            <PriceBox bgColor="#8b81ff" />
            <PriceBox bgColor="#685dea" />
          </PriceInfo>
        )}
      </VenueMetaWrapper>
    </VenueInfoWrapper>
    <VenueImage src={props.photo} alt={props.name} />
  </VenueWrapper>
);

export default VenueCard;

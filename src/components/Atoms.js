import React from 'react';
import styled from 'styled-components';
import { media, GothamFamily, doubleBounce } from 'utilities/style-mixins';

/*
"Atoms are the basic building blocks of matter. Applied to web interfaces, atoms are our HTML tags, such as a form label, an input or a button." - Brad Frost
(bradfrost.com/blog/post/atomic-web-design/)

This file contains the smallest parts of our UI, the Atoms, 
which will be the starting point of our design system. These components 
will be mostly used with 'extend' or 'withComponent' methods. 
@see https://www.styled-components.com/docs/basics#extending-styles

Exports:
Heading: h1,h2,h3 etc
Paragraph: For p tags, spans etc.
Link: a tag
Input: Form input elements
Button: Form button and submit elements
ScreenReaderText: Invisible text, for span, p etc.

 */

/**
 * Headings
 * Can be used with other tags: Heading.withComponent('h2')
 */
export const Heading = styled.h1`
  ${props => GothamFamily(props.gotham)};
  text-align: center;
  line-height: normal;
  color: #fff;
`;

/**
 * Paragraphs
 */
export const Paragraph = styled.p`
  ${props => GothamFamily(props.gotham)};
  font-size: 1em;
  text-align: center;
  line-height: normal;
  color: #fff;
`;

/**
 * Links
 */
const Anchor = Paragraph.withComponent('a');
export const Link = Anchor.extend`
  text-decoration: none;
  color: cornflowerblue;
  &:hover {
    text-decoration: underline;
  }
`;

/**
 * Input fields
 */
export const Input = styled.input`
  font-family: 'Gotham Medium', Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 0.875em;
  color: #333;
  background-color: #fff;
  box-shadow: 0 12px 21px 0 rgba(0, 0, 0, 0.24);
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 300px;
  padding: 16px 20px 15px 20px;
  border: 0;
  border-radius: 4px;
  margin: 0 auto 10px auto;
  ${media.laptop`
    display:inline-block;
    vertical-align: top;
    margin: 0 10px 0 0;
  `};
`;

/**
 * Buttons
 */
const InputButton = Input.withComponent('button');
export const Button = InputButton.extend`
  color: #fff;
  background-color: #ff5f5f;
  padding: 11px 25px 12px;
  cursor: pointer;
  margin: 0 auto 10px auto;
  ${media.laptop`
    display:inline-block;
    vertical-align: top;
    margin: 0;
    width: auto;
  `};
  > img {
    display: block;
    margin: 0 auto;
  }
  &:disabled {
    background-color: #ffa6a6;
  }
`;

/**
 * Screen Reader Text
 */
export const ScreenReaderText = styled.span`
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute !important;
  width: 1px;
  word-wrap: normal !important;
  &:focus {
    background-color: #f1f1f1;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    -webkit-box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
    clip: auto !important;
    color: #21759b;
    display: block;
    font-size: 14px;
    font-size: 0.875rem;
    font-weight: 700;
    height: auto;
    left: 5px;
    line-height: normal;
    padding: 15px 23px 14px;
    text-decoration: none;
    top: 5px;
    width: auto;
  }
`;

/**
 * A pure CSS spinner with keyframe animations.
 * Based on the beatiuful SpinKit loaders on:
 * https://github.com/tobiasahlin/SpinKit/blob/master/css/spinkit.css
 */
export const Loader = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  margin: 0 auto;
  &:before,
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${props => (props.color ? props.color : '#fff')};
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: ${doubleBounce} 2s infinite ease-in-out;
  }
  &:after {
    animation-delay: -1s;
  }
`;


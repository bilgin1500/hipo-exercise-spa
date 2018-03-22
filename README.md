# Front-end exercise with [Hipolabs](https://hipolabs.com/)

![Pizza in Las Vegas](http://res.cloudinary.com/bilginozkan/image/upload/v2/hipo-spa.png)

## About

This is an exercise application built with [React](https://reactjs.org) and [Foursquare API](https://developer.foursquare.com/docs/api/getting-started). To get started yo can clone the repo and install the dependencies using npm.

## Install

```
$ cd ~/
$ git clone https://github.com/bilgin1500/hipo-exercise-spa.git
$ cd hipo-exercise-spa
$ npm i
```

After installing the dependencies you can build the [development version](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a) via `npm run build` command and production version via `npm run build:prod` command. Both versions will be built into the `dist` folder (after first deleting it).

To run the website on your localhost you can use `npm start`. The port is :8080. (Which can be changed in the `src/utilities/config.js` file)

_In order to build and run the code you should have [node](https://nodejs.org/) and [npm](https://www.npmjs.com) installed._

## Hot it works?

The app uses React as its view layer, Redux for its persistent store and React Router for routing. Almost everything happening on the website, like fetching a data or parsing a response are logged into the Redux store. It's like a local database which saves the actions and through these actions changes the application's unique and persistent state. A representation of our store's data structure can be seen at `utilities/state-structure.js`.

We have 8 actions in total, which can be seen on `utilities/actions.js`. These are the building blocks and the smallest parts of our app's business logic. They can be chained together or used separately. A good example of chaining is the `fetchFoursquare` function on the `utilities/actions.js`. After fetching the Foursquare API this function controls how this separate actions get together and build a custom logic. This actions can also be used in components through a global dispatch method. A good example might be the `clearFetch` in the `components/Results.js` which clears some of the outdated info from the store when the component gets unmounted.

Another important aspect of the application is how it handles the data. After fetching the Foursquare API through the Redux actions we have to deal with the complex dataset of the API's response. This is where the normalizers step in. As seen on the `utilities/normalizers.js` we have mainly 2 data converter function, one for the 'explore' and one for the 'venue' endpoints. They take the data and change its shape according to our store's data structure. This step is necessary for the reducers (`utilities/reducers.js`) so that they can easily merge the incoming data with our local storage.

Finally, the updated store notifies all the connected components using React's top-down data flow and render the view. All of our components are inside the `components` folder. They're styled with Styled Components and they're using the `components/Atoms.js` as their building blocks. (I have to admit though that they can be [better arranged](https://gist.github.com/chantastic/fc9e3853464dffdb1e3c).) The mapper functions on the `utilities/state-mapper.js` are responsible for all the from-store-to-the-component data flow. There are currently 3 mappers, one for the search component, one for the results page and one for the venue detail page.

Below you can find all the files and their descriptions.

| File                             | Description                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| src/index.js                     | The app's starting point. It's a huge wrapper for all the React, Redux and Router stuff. |
| src/assets/\*                    | Fonts and images                                                                         |
| src/utilities/actions.js         | Redux actions                                                                            |
| src/utilities/config.js          | Global config file                                                                       |
| src/utilities/foursquare.js      | Foursquare API url builder                                                               |
| src/utilities/helpers.js         | isUndefined, isNull..                                                                    |
| src/utilities/history.js         | Router's hash history object                                                             |
| src/utilities/localstorage.js    | Localstorage API                                                                         |
| src/utilities/normalizers.js     | Data converters for our reducers                                                         |
| src/utilities/reducers.js        | Redux reducers                                                                           |
| src/utilities/state-mapper.js    | from-store-to-the-component controllers                                                  |
| src/utilities/state-structure.js | A representation of the Redux store                                                      |
| src/utilities/store.js           | Creates Redux store                                                                      |
| src/utilities/style-global.js    | Global CSS styles                                                                        |
| src/utilities/style-mixins.js    | CSS mixins                                                                               |
| src/components/Atoms.js          | Component atoms                                                                          |
| src/components/Footer.js         | Footer                                                                                   |
| src/components/Header.js         | Header wrapper                                                                           |
| src/components/Logo.js           | Logo                                                                                     |
| src/components/Message.js        | Search bar message                                                                       |
| src/components/Results.js        | Results page main area                                                                   |
| src/components/Search.js         | Search bar                                                                               |
| src/components/VenueAtoms.js     | Atomic parts for venue header and detail                                                 |
| src/components/VenueDetail.js    | Venue detail page main area                                                              |
| src/components/VenueHeader.js    | Venue detail page's header                                                               |
| src/components/Welcome.js        | Home page welcome text                                                                   |

## Tools

The project was developed with Sublime Text 3 (with the help of [Prettier](https://github.com/prettier/prettier) and [ESLint](https://eslint.org/) support) on Chrome Version 65 (macOS) using the great [Redux Dev Tool](https://github.com/zalmoxisus/redux-devtools-extension) and [React Dev Tool](https://github.com/facebook/react-devtools). Webpack is using [Babel.js](https://babeljs.io) to compile the next generation JavaScript. The configuration files .babelrc and .eslint can be seen on the root folder.

## Roadmap

Not an actual roadmap but a place for my notes on improvements:

*   To support a wider range of browsers things like Fetch and Promise JavaScript APIs and CSS object-fit must be polyfilled. Also a [browse happy](https://browsehappy.com/) link would be nice.
*   Need more tests.
    *   [x] Chrome Version 65 (macOS/desktop)
    *   [x] Firefox 57 (macOS/desktop)
    *   [x] Safari 11 (macOS/desktop)
*   Images should be loaded lazily via XHR.
*   FOUT issues must be solved.
*   The lack of transitions is a painful UX problem.

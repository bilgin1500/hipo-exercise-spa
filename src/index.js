import React from 'react';
import ReactDOM from 'react-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import 'images/favicon-16x16.png';
import 'images/favicon-32x32.png';

ReactDOM.render(
  <div>
    <Header />
    <Footer />
  </div>,
  document.getElementById('app')
);

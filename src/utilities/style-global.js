import { injectGlobal } from 'styled-components';

// Injector method of styled-components which appends
// a global stylesheet to the head of the document.
// ! This should only be used once
//
// @see https://www.styled-components.com/docs/api#injectglobal
injectGlobal`
  
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::placeholder {
    color:#9b9b9b;
  }
  
  @font-face {
    font-family: 'Gotham Book';
    src: url('/assets/fonts/Gotham-Book.otf');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Gotham Extra Light';
    src: url('/assets/fonts/Gotham-XLight.otf');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Gotham Medium';
    src: url('/assets/fonts/Gotham-Medium.otf');
    font-weight: normal;
    font-style: normal;
  }

`;

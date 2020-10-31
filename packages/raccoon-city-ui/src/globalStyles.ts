import {createGlobalStyle} from 'styled-components';

export function fontFace(name, src, fontWeight, fontStyle) {
    return `
      @font-face{
          font-family: "${name}";
          src: url(${require('../public/fonts/TTNorms/' + src + '.eot')});
          src: url(${require('../public/fonts/TTNorms/' + src + '.eot')}?#iefix) format("embedded-opentype"),
               url(${require('../public/fonts/TTNorms/' + src + '.woff')}) format("woff"),
               url(${require('../public/fonts/TTNorms/' + src + '.ttf')}) format("truetype"),

          font-style: ${fontStyle};
          font-weight: ${fontWeight};
      }
  `;
}

const GlobalStyle = createGlobalStyle`
  ${fontFace('TT Norms', 'TTNorms-Bold', 'bold', 'normal')}
  ${fontFace('TT Norms', 'TTNorms-ThinItalic', 100, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-Thin', 100, 'normal')}
  ${fontFace('TT Norms', 'TTNorms-LightItalic', 300, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-ExtraBoldItalic', 800, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-Italic', 'normal', 'italic')}
  ${fontFace('TT Norms', 'TTNorms-ExtraLight', 200, 'normal')}
  ${fontFace('TT Norms', 'TTNorms-HeavyItalic', 900, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-MediumItalic', 500, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-BoldItalic', 'bold', 'italic')}
  ${fontFace('TT Norms', 'TTNorms-Heavy', 900, 'normal')}
  ${fontFace('TT Norms', 'TTNorms-Light', 300, 'normal')}
  ${fontFace('TT Norms', 'TTNorms-Medium', 500, 'normal')}
  ${fontFace('TT Norms', 'TTNorms-ExtraBold', 800, 'normal')}
  ${fontFace('TT Norms', 'TTNorms-ExtraLightItalic', 200, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-Regular', 'normal', 'normal')}
  ${fontFace('TT Norms', 'TTNorms-BlackItalic', 900, 'italic')}
  ${fontFace('TT Norms', 'TTNorms-Black', 900, 'normal')}
`;

export default GlobalStyle;

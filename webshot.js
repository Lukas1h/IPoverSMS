// Mobile screenshot

const webshot = require('webshot');


const optionsMobile = {
  screenSize: {
    width: 750,
    height: 1334
  },
  shotSize: {
    width: 750,
    height: 'all'
  },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20A5358a [FBAN/FBIOS;FBDV/iPhone12,8;FBMD/iPhone;FBSN/iOS;FBSV/16.0;FBSS/2;FBID/phone;FBLC/de_DE;FBOP/5]'
};

webshot('http://www.penta-code.com', 'pentacode-mobile.png', optionsMobile, function(err) {
  if (!err) {
    console.log('Screenshot taken!');
  }
});
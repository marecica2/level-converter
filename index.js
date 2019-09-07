const fs = require('fs');
const Parser = require('fast-xml-parser');

const XMLParser = new Parser.j2xParser({
  ignoreAttributes: false,
  format: true,
  indentBy: "  ",
});

const {mapping} = require('./settings');

for (const item of mapping) {
  const {source, dest} = item;
  const xmlData = fs.readFileSync(source).toString();
  const nt8levels = Parser.parse(xmlData, {
    ignoreAttributes: false,
    parseAttributeValue: true,
  });
  let nt7Levels = '';
  for (const level of nt8levels['ArrayOfLevel']['Level']) {
    let opacity = 0;
    let tickerPrefix = level['@_Instrument'].length === 6 ? '$' : '';
    const number =  parseInt(level['@_LevelId'].replace(/\D/g, ''));
    if(isNaN(number)) {
      opacity = 0;
    } else if(number != null && (number === 0 || number === 100)) {
      opacity = 0;
    } else {
      opacity = 70;
    }
    const nt7level = {
      CustomLevel: {
        Settings: {
          IndicatorId: '637034386862885483',
          SessionType: 'Day',
          SessionValue: '1',
          Product: 'CustomLevels',
          Ticker: tickerPrefix + level['@_Instrument'],
          Label: null,
          Workspace: 'Market Profile VWAP',
        },
        Price: level['@_Price'],
        LineColor: opacity + ':' + (item.color || level.Line.Color),
        LineWidth: item.width || 1,
        LineStyle: 'Dash',
        Text: level.Caption['@_Text'],
        TextPosition: 'RightAbove',
        Visibility: 'AllWithThisInstrument',
        ShowInAllWorkspaces: true,
        AlertOn: false,
        AlertSound: 'Alert2.wav',
        Pips: 3,
        FileName: level['@_LevelId'],
        '@_LevelId': level['@_LevelId'],
        '@_Auto': false,
      }
    };
    nt7Levels += XMLParser.parse(nt7level);
  }
  var xml = '<?xml version="1.0" encoding="utf-8"?>\n'
      + '<ArrayOfCustomLevel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n' + nt7Levels + '</ArrayOfCustomLevel>';
  fs.writeFileSync(dest, xml);
}
const fs = require('fs');
const Parser = require('fast-xml-parser');

const XMLParser = new Parser.j2xParser({
  ignoreAttributes: false,
  format: true,
  indentBy: "  ",
});

const intraday = require('./intraday');
const swing = require('./swing');
const invest = require('./invest');
const test = require('./test');

const mappings = { intraday, swing, invest, test };
console.log('Copying the mapping: ', process.argv[2]);
const { mapping } = mappings[process.argv[2]];


for (const item of mapping) {
  const {source, dest} = item;
  const xmlData = fs.readFileSync(source).toString();
  const nt8levels = Parser.parse(xmlData, {
    ignoreAttributes: false,
    parseAttributeValue: true,
  });
  let nt7Levels = '';
  for (const level of nt8levels['ArrayOfLevel']['Level']) {
    let tickerPrefix = level['@_Instrument'].length === 6 ? '$' : '';
    let opacity = 0;
    const number =  parseInt(level['@_LevelId'].replace(/\D/g, ''));
    if(isNaN(number)) {
      opacity = 0;
    } else if(number != null && (number === 0 || number === 100)) {
      opacity = 0;
    } else {
      opacity = 70;
    }
    let levelId = level['@_LevelId'];
    if(levelId == null || levelId.length === 0) {
      levelId = level.Caption['@_Text'].replace(/\d+_/g, '');
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
          Workspace: 'Default',
        },
        Price: level['@_Price'],
        LineColor: opacity + ':' + (item.color || level.Line.Color),
        LineWidth: item.width || 1,
        LineStyle: 'Dash',
        Text: level.Caption['@_Text'].replace(/\{Level\.Price\}/g, ''),
        TextPosition: 'RightAbove',
        Visibility: 'AllWithThisInstrument',
        ShowInAllWorkspaces: true,
        AlertOn: false,
        AlertSound: 'Alert2.wav',
        Pips: 3,
        FileName: level['@_LevelId'],
        '@_LevelId': levelId,
        '@_Auto': false,
      }
    };
    nt7Levels += XMLParser.parse(nt7level);
    if(level.LinkedLevels && level.LinkedLevels.LinkedLevel) {
      if(!Array.isArray(level.LinkedLevels.LinkedLevel)) {
        level.LinkedLevels.LinkedLevel = [level.LinkedLevels.LinkedLevel];
      }
      for(const l of level.LinkedLevels.LinkedLevel) {
        const level1 = { ...nt7level };
        level1.CustomLevel.Price = level['@_Price'] - ( l.Distance * 0.00001 );
        level1.CustomLevel.LineColor = 50 + ':' + (item.color || level.Line.Color);
        level1.CustomLevel['@_LevelId'] = l['@_LevelId'];
        level1.CustomLevel.Text = level1.CustomLevel.Text += l.Caption['@_Text'].replace(/\{Level\.Price\}/g, '');
        nt7Levels += XMLParser.parse(level1);
      }
    }
  }
  var xml = '<?xml version="1.0" encoding="utf-8"?>\n'
      + '<ArrayOfCustomLevel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n' + nt7Levels + '</ArrayOfCustomLevel>';
  fs.writeFileSync(dest, xml);
}
const fs = require('fs');
const  parser = require('xml2json');
const json2xml = require('json2xml');


const { mapping } = require('./settings');

for(const item of mapping) {
  const { source, dest } = item;
  const nt8levels = JSON.parse(parser.toJson(fs.readFileSync(source)));
  const nt7levels = [];
  for(const level of nt8levels['ArrayOfLevel']['Level']){
    const nt7level = {
      CustomLevel: {
        Settings: {
          IndicatorId: '637033750448487993',
          SessionType: 'Day',
          SessionValue: '1',
          Product: 'Customlevels',
          Ticker: level.Instrument,
          Label: level.LevelId,
          Workspace: 'Default',
        },
        Price: level.Price,
        LineColor: '0:Teal',
        LineWidth: 2,
        LineStyle: 'Dash',
        Text: level.LevelId,
        TextPosition: 'RightAbove',
        Visibility: 'AllWithThisInstrument',
        ShowInAllWorkspaces: true,
        AlertOn: false,
        AlertSound: 'Alert2.wav',
        Pips: 3,
        FileName: level.LevelId,
      }
    };
    nt7levels.push(nt7level);
  }
  const nt7json = {'ArrayOfCustomLevel': nt7levels};
  console.log(JSON.stringify(nt7json, null, 2));
  fs.writeFileSync(dest, json2xml(nt7json));
}

// <ArrayOfCustomLevel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
//    <CustomLevel LevelId="" Auto="false">
//       <Settings>
//       <IndicatorId>637033750448487993</IndicatorId>
//       <SessionType>Day</SessionType>
//       <SessionValue>1</SessionValue>
//       <Product>CustomLevels</Product>
//       <Ticker>6B 09-19</Ticker>
//   <Label />
//   <Workspace>Default</Workspace>
//   </Settings>
//   <Price>1.2337</Price>
//   <LineColor>0:Teal</LineColor>
//   <LineWidth>2</LineWidth>
//   <LineStyle>Dash</LineStyle>
//   <Text>SETT</Text>
//   <TextPosition>RightAbove</TextPosition>
//   <Visibility>AllWithThisInstrument</Visibility>
//   <ShowInAllWorkspaces>true</ShowInAllWorkspaces>
//   <AlertOn>false</AlertOn>
//   <AlertSound>Alert2.wav</AlertSound>
//   <Pips>3</Pips>
//   <FileName>SETT</FileName>
//     </CustomLevel>
//   </ArrayOfCustomLevel>

// <?xml version="1.0" encoding="utf-8"?>
// <ArrayOfLevel xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//       <Level xsi:type="Chart" LevelId="SETT" Price="2.435" Instrument="NG 10-19" Workspace="CL_ALES">
//       <Guid>C83E04F0-A5A8-46CC-B837-3164D8D87DF6</Guid>
//   <Caption Text="6 SETT" Position="Right" />
//       <Line>
//       <Color>#FF01FE48</Color>
//       <Width>1</Width>
//       <DashStyle>Solid</DashStyle>
//       </Line>
//       <ZoneRangeLower>0</ZoneRangeLower>
//       <ZoneRangeUpper>0</ZoneRangeUpper>
//       <Alerts />
//       <StartTime />
//       <EndTime />
//       <ShowInAllWorkspaces>true</ShowInAllWorkspaces>
//       <LinkedLevels />
//       </Level>
//       <Level xsi:type="Chart" LevelId="SETT" Price="2.335" Instrument="NG 10-19" Workspace="CL_ALES">
//       <Guid>C83E04F0-A5A8-46CC-B837-3164D8D5596</Guid>
//   <Caption Text="6 SETT" Position="Right" />
//       <Line>
//       <Color>#FF01FE48</Color>
//       <Width>1</Width>
//       <DashStyle>Solid</DashStyle>
//       </Line>
//       <ZoneRangeLower>0</ZoneRangeLower>
//       <ZoneRangeUpper>0</ZoneRangeUpper>
//       <Alerts />
//       <StartTime />
//       <EndTime />
//       <ShowInAllWorkspaces>true</ShowInAllWorkspaces>
//       <LinkedLevels />
//       </Level>
//       </ArrayOfLevel>

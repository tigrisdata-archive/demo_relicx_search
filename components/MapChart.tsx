import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { IFacetEach } from './types';

type Props = {
  resultForMap: IFacetEach | undefined;
  setTooltipContent: Function;
};
const MapChart = ({ resultForMap, setTooltipContent }: Props) => {
  return (
    <>
      <div className='my-anchor-element'>
        <ComposableMap projection='geoEqualEarth'>
          <ZoomableGroup>
            <Geographies geography='/map.json'>
              {({ geographies }) =>
                geographies.map(geo => {
                  const d = resultForMap?._counts.find(s => s._value === geo.properties.name);

                  return (
                    <Geography
                      onMouseEnter={() => {
                        setTooltipContent(`${geo.properties.name} ${d ? d._count : ''}`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent(``);
                      }}
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? '#64748b' : '#EAEAEC'}
                      stroke='#d2d2d4'
                      data-tooltip-float='true'
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </>
  );
};

export default React.memo(MapChart);

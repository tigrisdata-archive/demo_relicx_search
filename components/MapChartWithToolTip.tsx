import { Card } from '@tremor/react';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import MapChart from './MapChart';
import { IFacetEach } from './types';
type Props = {
  data: IFacetEach;
};
const MapChartWithToolTip = ({ data }: Props) => {
  const [tooltipContent, setTooltipContent] = useState('');

  return (
    <Card marginTop='mt-0' hFull={true}>
      <MapChart resultForMap={data} setTooltipContent={setTooltipContent}></MapChart>

      <Tooltip
        anchorSelect='.rsm-geography'
        place='top'
        style={{ backgroundColor: '#f59e0b' }}
        content={tooltipContent}
      />
    </Card>
  );
};

export default MapChartWithToolTip;

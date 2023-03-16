import { Card } from '@tremor/react';
import MapChart from './MapChart';
import { IFacetEach } from './types';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';
type Props = {
  data: IFacetEach;
};
const MapChartWithToolTip = ({ data }: Props) => {
  const [tooltipContent, setTooltipContent] = useState('');
  return (
    <Card marginTop='mt-0' hFull={true}>
      <MapChart resultForMap={data} setTooltipContent={setTooltipContent}></MapChart>

      {/*ToolTip build is failing on vercel. Removing this until we fix this*/}
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

import { Card } from '@tremor/react';
import { useState } from 'react';
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
    </Card>
  );
};

export default MapChartWithToolTip;

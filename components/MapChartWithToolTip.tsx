import { Card } from '@tremor/react';
import MapChart from './MapChart';
import { IFacetEach } from './types';
type Props = {
  data: IFacetEach;
};
const MapChartWithToolTip = ({ data }: Props) => {
  return (
    <Card marginTop='mt-0' hFull={true}>
      <MapChart resultForMap={data}></MapChart>

      {/* ToolTip build is failing on vercel. Removing this until we fix this */}
      {/* <Tooltip
        anchorSelect='.rsm-geography'
        place='top'
        style={{ backgroundColor: '#f59e0b' }}
        content={tooltipContent}
      /> */}
    </Card>
  );
};

export default MapChartWithToolTip;

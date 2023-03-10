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
    </Card>
  );
};

export default MapChartWithToolTip;

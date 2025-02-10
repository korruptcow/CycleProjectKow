import Altitude from '@components/Metrics/Altitude';
import Heading from '@components/Metrics/Heading'
import Heartrate from '@components/Metrics/Heartrate';

import flagStore from '@store/flagStore';

import './Metrics.scss';
import Rpm from "@components/Metrics/rpm";

const OtherMetrics = () => {
  const { showMetrics } = flagStore.get();

  return (
    <div className="metrics-container dropdown-style" style={{ display: showMetrics ? '' : 'none' }}>
      <Heading />
      <Heartrate />
      <Altitude />
      <Rpm />
    </div>
  );
};

export default OtherMetrics;

import { ReactFitty } from 'react-fitty';

import './DateTime.scss';
import globalStore from '@store/globalStore';

const DateTime = () => {
  const dateTime = globalStore.get().time;
  return (
    <div className="time-container">
      <ReactFitty className="time">{dateTime}</ReactFitty>
    </div>
  );
};

export default DateTime;

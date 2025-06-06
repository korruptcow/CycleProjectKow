import valueFormatter from "@functions/valueFormatter.ts";

import flagStore from "@store/flagStore.ts"
import globalStore from "@store/globalStore.ts"
import './Distance.scss';
const Distance = () => {
    const {showDistance, useImperial} = flagStore.get();
    const {totalDistance} = globalStore.get();

    const {metric: totalMetric, imperial: totalImperial} = valueFormatter('distance', totalDistance);

    return (
        <div className="distance-container" style={{display: showDistance ? '' : 'none'}}>
            <div className="distance-text">
                Distance: {useImperial ? totalImperial : totalMetric}
            </div>
        </div>
    )
}

export default Distance;
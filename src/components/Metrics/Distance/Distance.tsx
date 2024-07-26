import valueFormatter from "@functions/valueFormatter";

import flagStore from "@store/flagStore"
import globalStore from "@store/globalStore"

const Distance = () => {
    const {showDistance, useImperial} = flagStore.get();
    const {totalDistance} = globalStore.get();
    const {goalDistance} = globalStore.get();

    const {metric: totalMetric, imperial: totalImperial} = valueFormatter('distance', totalDistance);
    const {metric: goalMetric, imperial: goalImperial} = valueFormatter('distance', goalDistance);

    return (
        <div className="distance-text" style={{display: showDistance ? '' : 'none'}}>
            Distance du jour: {useImperial ? totalImperial : totalMetric} <br/>
            Distance restante: {useImperial ? goalImperial : goalMetric}
        </div>
    )
}

export default Distance
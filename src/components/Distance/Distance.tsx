import valueFormatter from "@functions/valueFormatter.ts";

import flagStore from "@store/flagStore.ts"
import globalStore from "@store/globalStore.ts"
import './Distance.scss';
const Distance = () => {
    const {showDistance, useImperial} = flagStore.get();
    const {totalDistance} = globalStore.get();
    const {sessionDistance} = globalStore.get();
    const {goalDistance} = globalStore.get();

    const {metric: totalMetric, imperial: totalImperial} = valueFormatter('distance', totalDistance);
    const {metric: sessionMetric, imperial: sessionImperial} = valueFormatter('distance', sessionDistance);
    const {metric: goalMetric, imperial: goalImperial} = valueFormatter('distance', goalDistance);

    return (
        <div className="distance-container dropdown-style">
            <img src='assets/distance.svg' alt="Speed Icon" style={{ width: '54px', height: '54px'}} />
            <div className="distance-text" style={{display: showDistance ? '' : 'none'}}>
                Jour: {useImperial ? sessionImperial : sessionMetric} <br/>
                Total: {useImperial ? totalImperial : totalMetric} <br/>
                Restant: {useImperial ? goalImperial : goalMetric}
            </div>
        </div>
    )
}

export default Distance;
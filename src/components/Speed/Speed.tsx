import flagStore from "@store/flagStore.ts"
import globalStore from "@store/globalStore.ts"

import valueFormatter from "@functions/valueFormatter.ts";
import './Speed.scss';

const Speed = () => {
    const {showSpeed, useImperial} = flagStore.get();
    const {speed} = globalStore.get();
    const {metric, imperial} = valueFormatter('speed', speed)
    return (
        <div className="speed-container" style={{display: showSpeed ? '' : 'none'}}>
            <div className="speed-text">
                <span className="speed-value">
                    Speed: {useImperial ? imperial : metric}
                </span>
            </div>
        </div>
    )
}

export default Speed;
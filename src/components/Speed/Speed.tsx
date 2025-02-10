import flagStore from "@store/flagStore.ts"
import globalStore from "@store/globalStore.ts"

import valueFormatter from "@functions/valueFormatter.ts";
import './Speed.scss';

const Speed = () => {
    const {showSpeed, useImperial} = flagStore.get();
    const {speed} = globalStore.get();
    const {metric, imperial} = valueFormatter('speed', speed)
    return (
        <div className="speed-container dropdown-style-cropped" style={{display: showSpeed ? '' : 'none'}}>
            <span className="icon"><img src='assets/meter.svg' alt="Speed Icon" style={{width: '54px', height: '54px', marginLeft: '24px'}}/></span>
            <div className="speed-text">
                <span className="speed-value">
                    {useImperial ? imperial : metric}
                </span>
            </div>
        </div>
    )
}

export default Speed;
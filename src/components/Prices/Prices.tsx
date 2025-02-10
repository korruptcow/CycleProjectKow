import flagStore from "@store/flagStore.ts"
import globalStore from "@store/globalStore.ts"

import './Prices.scss';
import valueFormatter from "@functions/valueFormatter.ts";

const Prices = () => {
    const { showPrices, currency, useImperial } = flagStore.get();
    const { subRatio, donationRatio } = globalStore.get();
    const { metric, imperial } = valueFormatter('distancePrice', 1);
    const { metric: subRatioMetric, imperial: subRatioImperial } = valueFormatter('distance', subRatio);
    return (
        <div className="prices-container dropdown-style-cropped" style={{display: showPrices ? '' : 'none'}}>
            <div>
                <span className="icon"><img src='assets/price.svg' alt="Prices Icon" style={{width: '24px', height: '24px'}}/></span>
            </div>
            <div className="prices">
                <div className="price-text">
                    <label> 1 Sub : </label>
                    <span id="sub-price" className="price-value">
                        { useImperial ? subRatioImperial : subRatioMetric }
                    </span>
                </div>
                <div className="price-text">
                    <label> {useImperial ? imperial : metric} : </label>
                    <span id="donation-price" className="price-value">
                        { donationRatio == 0 ? 0 : 1 / donationRatio} { currency == 'dollar' ? '$' : '€' }
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Prices;
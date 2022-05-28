import "./ScalingTab.css"

import EventIcons from "../../Utils/EventIcons";

function ScalingTab(props) {

    return <div className="scaling-tab-container"> <button
        className="zoom-btn" onClick={() => { props.onScaleChange("zoom_in") }}>
        <svg width={18}
            height={18}>
            <image
                href={EventIcons.getIcons()["zoom_in"]}
                width={18}
                height={18}
            ></image>
        </svg>
    </button>
        <button
            className="zoom-btn" onClick={() => { props.onScaleChange("zoom_out") }}>
            <svg width={18}
                height={18}>
                <image
                    href={EventIcons.getIcons()["zoom_out"]}
                    width={18}
                    height={18}
                ></image>
            </svg>
        </button>
    </div>
}

export default ScalingTab;
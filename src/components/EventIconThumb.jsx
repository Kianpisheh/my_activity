import "./EventIconThumb.css"

import { hexToCSSFilter } from 'hex-to-css-filter';

import EventIcons from "../Utils/EventIcons";

function EventIconThumb(props) {
    const { config, objects, events, times } = props;
    const { ic_w, ic_h, scale } = config;
    const svgWidth = Math.ceil(scale * props.tmax);
    const vb = "0 0 " + svgWidth + " " + ic_h;

    const t = objects[events[0]];

    return (
        <div className="event-icon-thumb-conatiner" style={{ width: "100%" }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vb}
                width={svgWidth}
                height={ic_h}
                style={{ float: "left" }}
            >
                {times.map((time, idx) => {
                    return (
                        <image
                            key={idx}
                            href={objects[events[idx]]}
                            width={ic_w}
                            height={ic_h}
                            x={scale * time.t1}
                        ></image>
                    );
                })}
            </svg>
        </div>
    );
}

export default EventIconThumb;

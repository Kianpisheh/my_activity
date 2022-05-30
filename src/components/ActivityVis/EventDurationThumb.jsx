import "./EventDurationThumb.css";

import EventIcons from "../../Utils/EventIcons";

function EventDurationThumb(props) {
    const { rc_h, r, scale } = props.config;
    const svgWidth = Math.ceil(scale * props.tmax);
    const vb = "0 0 " + svgWidth + " " + rc_h;

    console.log("times: ", props.times);
    console.log("events: ", props.events);

    return (
        <div
            className="event-duration-thumb-conatiner"
            style={{ width: "100%", height: 2 * rc_h }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vb}
                width={svgWidth}
                height={rc_h}
                style={{ float: "left" }}
                preserveAspectRatio="none"
            >
                {props.times.map((time, idx) => {
                    return (
                        (props.filters.includes(props.events[idx]) || props.filters === "") && <rect
                            key={idx}
                            x={scale * time.startTime}
                            y={0}
                            width={scale * (time.endTime - time.startTime)}
                            height={rc_h}
                            rx={r}
                            fill={EventIcons.getColor(props.events[idx])}
                        ></rect>
                    );
                })}
            </svg>
        </div>
    );
}

export default EventDurationThumb;

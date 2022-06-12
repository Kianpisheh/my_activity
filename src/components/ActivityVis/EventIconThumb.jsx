import { mergeConsecEvents, scaleTimes, mergeCloseEvents, getEventIconPlacement } from "../../Utils/utils";
import "./EventIconThumb.css";
import EventIcons from "../../Utils/EventIcons";
import { ReactComponent as YourSvg } from '../../images/action_events/mug.svg';

function EventIconThumb(props) {
    const {
        config,
        objects,
        explanationEvents,
        eventIndividuals,
    } = props;
    const { ic_w, ic_h, scale, merge_th, nonlScale, r, rc_h } = config;
    const svgWidth = Math.ceil(scale * props.tmax);
    const vb = "0 0 " + svgWidth + " " + ic_h;

    let { times, events } = mergeConsecEvents(props.times, props.events, merge_th);
    times = nonlScale ? scaleTimes(times) : times;
    let merged = mergeCloseEvents(times, events, 2);
    const times2 = merged["times"];
    const events2 = merged["events"];

    let filteredNum = 0;
    for (let i = 0; i < events.length; i++) {
        if (props.filters.includes(events[i])) {
            filteredNum += 1;
        }
    }

    const Y = getEventIconPlacement(times2, scale, ic_w);


    return (
        <div className="event-icon-thumb-conatiner">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vb}
                width={svgWidth}
                height="100%"
                style={{ float: "left" }}
            >
                {times.map((time, idx) => {
                    return (
                        (props.filters.includes(events[idx]) ||
                            filteredNum === 0) && (
                            <rect
                                key={idx}
                                x={scale * time.startTime}
                                y={18}
                                width={scale * (time.endTime - time.startTime)}
                                height={2 * rc_h}
                                rx={r}
                                fill={EventIcons.getColor(events[idx])}
                            // onMouseEnter={() => { setShowPositionTip(true) }}
                            ></rect>
                        )
                    );
                })}
                {times2.map((time, idx) => {
                    let iconStyle = {};
                    if (explanationEvents) {
                        if (explanationEvents.includes(eventIndividuals[idx])) {
                            iconStyle = {
                                fill: "none",
                                stroke: "#2C87DB",
                                strokeWidth: 2,
                                opacity: 0.6
                            }
                        }
                    }
                    return (
                        (props.filters.includes(events2[idx]) ||
                            filteredNum === 0) && (
                            <g key={idx}>
                                <image
                                    className="svg-img"
                                    y={Y[idx]}
                                    key={idx}
                                    href={objects.get(events2[idx])}
                                    width={ic_w}
                                    height={ic_h}
                                    x={scale * time.startTime}
                                ></image>
                            </g>
                        )
                    );
                })}
            </svg>
        </div>
    );
}

export default EventIconThumb;

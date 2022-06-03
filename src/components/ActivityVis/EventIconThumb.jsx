import "./EventIconThumb.css";

function EventIconThumb(props) {
    const {
        config,
        objects,
        events,
        times,
        explanationEvents,
        eventIndividuals,
    } = props;
    const { ic_w, ic_h, scale } = config;
    const svgWidth = Math.ceil(scale * props.tmax);
    const vb = "0 0 " + svgWidth + " " + ic_h;

    let filteredNum = 0;
    for (let i = 0; i < events.length; i++) {
        if (props.filters.includes(events[i])) {
            filteredNum += 1;
        }
    }
    return (
        <div className="event-icon-thumb-conatiner">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vb}
                width={svgWidth}
                height={ic_h + 5}
                style={{ float: "left" }}
            >
                {times.map((time, idx) => {
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
                        (props.filters.includes(events[idx]) ||
                            filteredNum === 0) && (
                            <g>
                                <image
                                    key={idx}
                                    href={objects.get(events[idx])}
                                    width={ic_w}
                                    height={ic_h}
                                    x={scale * time.startTime}
                                ></image>
                                {(Object.keys(iconStyle).length > 0) && <rect
                                    x={scale * time.startTime}
                                    width={ic_w}
                                    height={ic_h}
                                    style={iconStyle}
                                ></rect>}
                            </g>
                        )
                    );
                })}
            </svg>
        </div>
    );
}

export default EventIconThumb;

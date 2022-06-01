import "./EventIconThumb.css"

function EventIconThumb(props) {
    const { config, objects, events, times } = props;
    const { ic_w, ic_h, scale } = config;
    const svgWidth = Math.ceil(scale * props.tmax);
    const vb = "0 0 " + svgWidth + " " + ic_h;

    console.log("obj: ", objects);
    console.log("events: ", events);
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
                height={ic_h}
                style={{ float: "left" }}
            >
                {times.map((time, idx) => {
                    return (
                        (props.filters.includes(events[idx]) || filteredNum === 0) && < image
                            key={idx}
                            href={objects.get(events[idx])}
                            width={ic_w}
                            height={ic_h}
                            x={scale * time.startTime}
                        ></image>
                    );
                })}
            </svg>
        </div >
    );
}

export default EventIconThumb;


import "./TimeAxis.css";

function TimeAxis(props) {


    const { scale, ax_h, major_tick, major_tick_h, minor_tick_h, minor_tick } = props.config;
    const svgWidth = Math.ceil(scale * props.tmax);

    const vb = "0 0 " + svgWidth + " " + ax_h;

    const sk = getSkipRate(scale)
    const majorTicks = getTicks(props.tmax, scale, major_tick).filter((value, idx) => { return idx % sk === 0 });
    const minorTicks = getTicks(props.tmax, scale, minor_tick)
    const times = getTimes(major_tick, props.tmax).filter((value, idx) => { return idx % sk === 0 });;
    let formattedTimes = getFormattedTime(times);


    return (
        <div className="time-axis-constainer">
            <svg
                className="axis-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vb}
                width={scale * props.tmax}
                height={ax_h}
            >
                <line
                    x1="0"
                    y1={Math.floor(ax_h / 2)}
                    x2={svgWidth}
                    y2={Math.floor(ax_h / 2)}
                    stroke="black"
                    strokeWidth={2}
                ></line>
                <g id="axes-ticks">
                    {majorTicks.map((x, idx) => {
                        return (
                            <line
                                key={idx}
                                x1={x}
                                x2={x}
                                y1={Math.floor(ax_h / 2)}
                                y2={Math.floor(ax_h / 2) - major_tick_h}
                                stroke="black"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                            ></line>
                        );
                    })}
                </g>
                <g id="axes-minor-ticks">
                    {minorTicks.map((x, idx) => {
                        return (
                            <line
                                key={idx}
                                x1={x}
                                x2={x}
                                y1={Math.floor(ax_h / 2)}
                                y2={Math.floor(ax_h / 2) - minor_tick_h}
                                stroke="black"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                            ></line>
                        );
                    })}
                </g>
                <g id="axes-numbers">
                    {majorTicks.map((x, idx) => {
                        return (
                            <text
                                key={idx}
                                x={x - 8}
                                y={Math.floor(ax_h / 2) + 8}
                                fontSize={8}
                                style={{ fill: "black" }}
                            >
                                {formattedTimes[idx]}
                            </text>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

function getTicks(tmax, scale, major_tick) {
    const tickNum = Math.floor(tmax / major_tick);
    let positions = [];
    for (let i = 0; i < tickNum - 1; i++) {
        positions.push(major_tick * scale * (i + 1));
    }

    return positions;
}

function getTimes(major_tick, tmax) {
    const tickNum = Math.floor(tmax / major_tick);
    let times = [];
    for (let i = 0; i < tickNum - 1; i++) {
        times.push(major_tick * (i + 1));
    }

    return times;
}

function getFormattedTime(secs) {
    let formattedTime = [];

    for (let i = 0; i < secs.length; i++) {
        const m = Math.floor(secs[i] / 60); // minutes
        const s = secs[i] - m * 60;
        formattedTime.push(
            m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
        );
    }

    return formattedTime;
}

function getSkipRate(scale) {
    if (scale < 10) {
        return 4;
    } else if (scale < 15) {
        return 3;
    } else if (scale < 20) {
        return 2;
    } else if (scale < 30) {
        return 1;
    }
    return 1;
}

export default TimeAxis;

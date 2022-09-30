import { useState, useRef, useEffect } from "react";

import "./EventDurationThumb.css";

import EventIcons from "../../Utils/EventIcons";
import { mergeConsecEvents, scaleTimes } from "../../Utils/utils";

function EventDurationThumb(props) {
	//const [svgX, setSvgX] = useState(0);
	const [mouseX, setMouseX] = useState(-1);
	const [showPositionTip, setShowPositionTip] = useState(false);
	const mainSvgRef = useRef();

	const { rc_h, r, scale, merge_th, nonlScale } = props.config;
	let { times, events } = props;
	const svgWidth = Math.ceil(scale * props.tmax);
	const vb = "0 0 " + svgWidth + " " + rc_h;

	if (merge_th) {
		({ times, events } = mergeConsecEvents(times, events, merge_th));
	}
	times = nonlScale ? scaleTimes(times) : times;

	let filteredNum = 0;
	for (let i = 0; i < events.length; i++) {
		if (props.filters.includes(events[i])) {
			filteredNum += 1;
		}
	}

	return (
		<div
			className="event-duration-thumb-conatiner"
			style={{ width: "100%", height: 2 * rc_h }}
			onMouseMove={(ev) => setMouseX(ev.pageX)}
			onMouseLeave={() => setShowPositionTip(false)}
		>
			{showPositionTip && (
				<div
					style={{
						position: "absolute",
						padding: 3,
						borderRadius: 3,
						backgroundColor: "#CFC9B9",
						fontSize: 11,
						left: mouseX,
					}}
				>
					{getFormattedTime([(mouseX - Math.floor(mainSvgRef.current.getBoundingClientRect().x)) / scale])}
				</div>
			)}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				ref={mainSvgRef}
				viewBox={vb}
				width={svgWidth}
				height={rc_h}
				style={{ float: "left" }}
				preserveAspectRatio="none"
			>
				{times.map((time, idx) => {
					return (
						(props.filters.includes(events[idx]) || filteredNum === 0) && (
							<rect
								key={idx}
								x={scale * time.startTime}
								y={0}
								width={scale * (time.endTime - time.startTime)}
								height={rc_h}
								rx={r}
								fill={EventIcons.getColor(events[idx])}
								onMouseEnter={() => {
									setShowPositionTip(true);
								}}
							></rect>
						)
					);
				})}
			</svg>
		</div>
	);
}

function getFormattedTime(secs) {
	let formattedTime = [];

	for (let i = 0; i < secs.length; i++) {
		const m = Math.floor(secs[i] / 60); // minutes
		const s = secs[i] - m * 60;
		formattedTime.push(m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0"));
	}

	return formattedTime;
}

export default EventDurationThumb;

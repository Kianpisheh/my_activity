import { useState } from "react";
import "./RangeVis.css";

function RangeVis(props) {
	// dimentions
	const w = props.sliderWidth;
	const h = 40;

	const [thresholdChange, setThresholdChange] = useState([false, false]);
	const [refX, setRefX] = useState(0);

	const { times, allTimes } = props;

	if (times.length === 0) {
		return;
	}

	let timesList = [];
	for (const ts of times) {
		timesList = timesList.concat(Object.values(ts)[0]);
	}

	// time annotations in seconds
	let secs = [];
	const range = props.maxVal - props.minVal;

	if (range === 0) {
		secs = [props.minVal];
	} else if (range < 5) {
		secs = [onePrecision(props.minVal), onePrecision(props.minVal + range / 2), onePrecision(props.maxVal)];
	} else {
		secs = [
			props.minVal,
			onePrecision(props.minVal + range / 4),
			onePrecision(props.minVal + range / 2),
			onePrecision(props.minVal + (3 * range) / 4),
			props.maxVal,
		];
	}

	return (
		<div
			style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", width: 1.5 * w }}
			onMouseMove={(ev) => {
				if (thresholdChange[0] && props.sliderPos[0] + ev.clientX - refX < props.sliderPos[1]) {
					if (
						posToTime(props.sliderPos[0] + ev.clientX - refX, props.minVal, props.maxVal, w) >= props.minVal
					) {
						props.onSliderPosChange(props.sliderPos[0] + ev.clientX - refX, props.sliderPos[1]);
						setRefX(ev.clientX);
						const instancesIdx = getEnclosedInstances(
							props.sliderPos[0] + ev.clientX - refX,
							props.sliderPos[1],
							props.minVal,
							props.maxVal,
							w,
							times,
							allTimes
						);
						props.onTimeSliderChange(instancesIdx);
					}
				} else if (thresholdChange[1] && props.sliderPos[1] + ev.clientX - refX > props.sliderPos[0]) {
					if (
						posToTime(props.sliderPos[1] + ev.clientX - refX, props.minVal, props.maxVal, w) <= props.maxVal
					) {
						props.onSliderPosChange(props.sliderPos[0], props.sliderPos[1] + ev.clientX - refX);
						setRefX(ev.clientX);
						const instancesIdx = getEnclosedInstances(
							props.sliderPos[0],
							props.sliderPos[1] + ev.clientX - refX,
							props.minVal,
							props.maxVal,
							w,
							times,
							allTimes
						);
						props.onTimeSliderChange(instancesIdx);
					}
				}
			}}
			onMouseUp={() => setThresholdChange([false, false])}
			onMouseLeave={() => setThresholdChange([false, false])}
		>
			<svg key={props.idx + "svg"} width={w} height={h}>
				<line
					key={props.idx + "ln"}
					x1={0}
					x2={w - 30}
					y1={h / 2}
					y2={h / 2}
					stroke="#666666"
					strokeWidth={2}
					strokeLinecap="round"
				></line>
				{timesList.map((value, idx) => {
					let x = timeToPos(value, props.minVal, props.maxVal, w);
					if (props.minVal === props.maxVal) {
						x = w / 2 + 3;
					}
					return <circle key={idx} cy={h / 2} cx={x} r={4} fill="var(--explanation)" opacity={0.5}></circle>;
				})}
				<line
					key={props.idx + "ln2"}
					x1={props.sliderPos[0]}
					x2={props.sliderPos[0]}
					y1={h / 2 + 5}
					y2={h / 2 - 5}
					stroke="#F1258B"
					strokeWidth={5}
					onMouseDown={(ev) => {
						setThresholdChange([true, false]);
						setRefX(ev.clientX);
					}}
					strokeOpacity={0.8}
					strokeLinecap="round"
					onClick={() => console.log("asd")}
				></line>
				<line
					key={props.idx + "ln3"}
					x1={props.sliderPos[1]}
					x2={props.sliderPos[1]}
					y1={h / 2 + 5}
					y2={h / 2 - 5}
					stroke="#F1258B"
					strokeOpacity={0.8}
					strokeWidth={5}
					onMouseDown={(ev) => {
						setThresholdChange([false, true]);
						setRefX(ev.clientX);
					}}
					strokeLinecap="round"
				></line>
				{secs.map((s, idx) => {
					let x = ((s - props.minVal) / (props.maxVal - props.minVal)) * (w - 30) + 2;
					if (props.minVal === props.maxVal) {
						x = w / 2;
					}
					return (
						<text key={s} color="#777777" fontSize={11} x={x} y={14 + h / 2} pointerEvents="none">
							{s}
						</text>
					);
				})}
				<text
					key={props.idx + "txt"}
					fontSize={11}
					color="#777777"
					x={w - 15}
					y={3 + h / 2}
					style={{ pointerEvents: "none" }}
				>
					sec
				</text>
			</svg>
		</div>
	);
}

export default RangeVis;

function onePrecision(value) {
	return Math.round(10 * value) / 10;
}

function timeToPos(s, minVal, maxVal, w) {
	return ((s - minVal) / (maxVal - minVal)) * (w - 30) + 5;
}

function posToTime(x, minVal, maxVal, w) {
	return minVal + ((x - 5) * (maxVal - minVal)) / (w - 30);
}

function getEnclosedInstances(x1, x2, minVal, maxVal, w, times, allTimes) {
	const t1 = posToTime(x1, minVal, maxVal, w);
	const t2 = posToTime(x2, minVal, maxVal, w);

	let instancesIdx = [];
	for (const act of Object.keys(allTimes)) {
		for (const tts of allTimes[act]) {
			const idx = Object.keys(tts)[0];
			for (const t of Object.values(tts)[0]) {
				if (t1 <= t && t <= t2) {
					instancesIdx.push(Number(idx));
					break;
				}
			}
		}
	}

	return instancesIdx;
}

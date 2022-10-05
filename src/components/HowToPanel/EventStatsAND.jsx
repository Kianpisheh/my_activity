import { useState } from "react";
import RangeVis from "./RangeVis";

function EventStatsAND(props) {
	const sliderWidth = 180;
	const [sliderPos, setSliderPos] = useState([10, (2 * (sliderWidth - 30)) / 3]);

	const { coverages, timeDistanceRanges, numActivity, durationRanges, timeDistances, durations, onWhyNotHover } =
		props;

	let tds = [];
	let ds = [];
	if (timeDistances && Object.keys(timeDistances).length) {
		for (const td in timeDistances) {
			for (const ts of Object.values(timeDistances[td])) {
				tds = tds.concat(Object.values(ts)[0]);
			}
		}
	}

	if (durations && Object.keys(durations).length) {
		for (const d in durations) {
			for (const ts of Object.values(durations[d])) {
				ds = ds.concat(Object.values(ts)[0]);
			}
		}

		const tdMaxVal = Math.round(10 * Math.max(...tds)) / 10;
		const tdMinVal = Math.round(10 * Math.min(...tds)) / 10;

		const dMaxVal = Math.round(10 * Math.max(...ds)) / 10;
		const dMinVal = Math.round(10 * Math.min(...ds)) / 10;

		return Object.keys(coverages).map((act, idx) => {
			return (
				act !== "" &&
				parseInt(coverages[act].length) !== 0 && (
					<div
						key={idx}
						className="single-stat-container"
						onMouseOver={() => onWhyNotHover(coverages[act])}
						onMouseLeave={() => {
							onWhyNotHover([]);
							props.onTimeSliderChange([]);
						}}
						onMouseEnter={() => {
							const instancesIdx = getEnclosedInstances(
								sliderPos[0],
								sliderPos[1],
								tdMinVal === Infinity ? dMinVal : tdMinVal,
								tdMaxVal === -Infinity ? dMaxVal : tdMaxVal,
								sliderWidth,
								timeDistances[act] ? timeDistances[act] : durations[act],
								timeDistances && timeDistances.length ? timeDistances : durations
							);
							props.onTimeSliderChange(instancesIdx);
						}}
					>
						<span className="stat-activity-title" style={{ fontSize: 13, fontWeight: 600 }}>
							{act}
						</span>
						<div className="stats">
							<div style={{ display: "flex", alignItems: "flex-end", columnGap: 10 }}>
								<span style={{ height: 31 }}>
									<span style={{ fontSize: 12 }}>Occurrance:{"  "}</span>
									<span style={{ fontSize: 25, color: "var(--explanation)" }}>
										{" "}
										{coverages[act].length + " / " + numActivity[act]}
									</span>
									<span style={{ fontSize: 12, marginLeft: "0.1em" }}> time(s)</span>
								</span>
							</div>
							{timeDistanceRanges[act] && (
								<div
									key={"td" + act}
									className="range-container"
									style={{ display: "flex", alignItems: "flex-end", columnGap: 10 }}
								>
									<span style={{ height: 31 }}>
										<span style={{ fontSize: 12 }}>Time distance:{"  "}</span>
									</span>
									<div className="range-vis">
										<RangeVis
											times={timeDistances[act]}
											allTimes={timeDistances}
											minVal={tdMinVal}
											maxVal={tdMaxVal}
											sliderWidth={sliderWidth}
											idx={idx + "timedistance" + act}
											onTimeSliderChange={props.onTimeSliderChange}
											sliderPos={sliderPos}
											onSliderPosChange={(x1, x2) => setSliderPos([x1, x2])}
										></RangeVis>
									</div>
								</div>
							)}
							{durationRanges[act]?.length > 0 && (
								<div
									key={"du" + act}
									className="range-container"
									style={{ display: "flex", alignItems: "flex-end", columnGap: 10 }}
								>
									<span style={{ height: 31 }}>
										<span style={{ fontSize: 12 }}>Duration:{"  "}</span>
									</span>
									<div className="range-vis">
										<RangeVis
											times={durations[act]}
											allTimes={durations}
											minVal={dMinVal}
											maxVal={dMaxVal}
											sliderWidth={sliderWidth}
											idx={idx + "duration" + act}
											onTimeSliderChange={props.onTimeSliderChange}
											sliderPos={sliderPos}
											onSliderPosChange={(x1, x2) => setSliderPos([x1, x2])}
										></RangeVis>
									</div>
								</div>
							)}
						</div>
					</div>
				)
			);
		});
	}
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

export default EventStatsAND;

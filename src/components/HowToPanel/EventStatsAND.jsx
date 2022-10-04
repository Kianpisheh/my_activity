import RangeVis from "./RangeVis";

function EventStatsAND(props) {
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
						onMouseLeave={() => onWhyNotHover([])}
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
											minVal={tdMinVal}
											maxVal={tdMaxVal}
											idx={idx + "timedistance" + act}
											onTimeSliderChange={props.onTimeSliderChange}
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
											minVal={dMinVal}
											maxVal={dMaxVal}
											idx={idx + "duration" + act}
											onTimeSliderChange={props.onTimeSliderChange}
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

export default EventStatsAND;

import RangeVis from "./RangeVis";

function EventStatsAND(props) {
	const { coverages, timeDistanceRanges, numActivity, durationRanges, timeDistances, durations } = props;

	let tds = [];
	let ds = [];
	if (timeDistances && Object.keys(timeDistances).length) {
		for (const td in timeDistances) {
			tds = tds.concat(timeDistances[td]);
		}
	}

	if (durations && Object.keys(durations).length) {
		for (const d in durations) {
			ds = ds.concat(durations[d]);
		}
	}

	const tdMaxVal = Math.round(10 * Math.max(...tds)) / 10;
	const tdMinVal = Math.round(10 * Math.min(...tds)) / 10;

	const dMaxVal = Math.round(10 * Math.max(...ds)) / 10;
	const dMinVal = Math.round(10 * Math.min(...ds)) / 10;

	return Object.keys(coverages).map((act, idx) => {
		return (
			act !== "" &&
			parseInt(coverages[act]) !== 0 && (
				<div key={idx} className="single-stat-container">
					<span className="stat-activity-title" style={{ fontSize: 13, fontWeight: 600 }}>
						{act}
					</span>
					<div className="stats">
						<div style={{ display: "flex", alignItems: "flex-end", columnGap: 10 }}>
							<span style={{ height: 31 }}>
								<span style={{ fontSize: 12 }}>Occurrance:{"  "}</span>
								<span style={{ fontSize: 25, color: "var(--explanation)" }}>
									{" "}
									{coverages[act] + " / " + numActivity[act]}
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
									{/* {timeDistanceRanges[act][0] !== timeDistanceRanges[act][1] && (
												<span style={{ fontSize: 12 }}>between{"  "}</span>
											)}
											<span
												style={{
													fontSize: 25,
													marginLeft: "0.1em",
													color: "var(--explanation)",
												}}
											>
												{Math.round(10 * parseFloat(timeDistanceRanges[act][0])) / 10}
											</span>
											{timeDistanceRanges[act][0] !== timeDistanceRanges[act][1] && (
												<span style={{ fontSize: 12, marginLeft: "0.3em" }}>and</span>
											)}
											{timeDistanceRanges[act][0] !== timeDistanceRanges[act][1] && (
												<span
													style={{
														fontSize: 25,
														marginLeft: "0.1em",
														color: "var(--explanation)",
													}}
												>
													{Math.round(10 * parseFloat(timeDistanceRanges[act][1])) / 10}
												</span>
											)}
											<span style={{ fontSize: 12, marginLeft: "0.1em" }}> second(s)</span> */}
								</span>
								<div className="range-vis">
									<RangeVis
										numbers={timeDistances[act]}
										minVal={tdMinVal}
										maxVal={tdMaxVal}
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
									{/* {durationRanges[act][0] !== durationRanges[act][1] && (
												<span style={{ fontSize: 12 }}>between{"  "}</span>
											)}
											<span
												style={{
													fontSize: 25,
													marginLeft: "0.1em",
													color: "var(--explanation)",
												}}
											>
												{Math.round(10 * parseFloat(durationRanges[act][0])) / 10}
											</span>
											{durationRanges[act][0] !== durationRanges[act][1] && (
												<span style={{ fontSize: 12, marginLeft: "0.3em" }}>and</span>
											)}
											{durationRanges[act][0] !== durationRanges[act][1] && (
												<span
													style={{
														fontSize: 25,
														marginLeft: "0.1em",
														color: "var(--explanation)",
													}}
												>
													{Math.round(10 * parseFloat(durationRanges[act][1])) / 10}
												</span>
											)}
											<span style={{ fontSize: 12, marginLeft: "0.1em" }}> second(s)</span> */}
								</span>
								<div className="range-vis">
									<RangeVis numbers={durations[act]} minVal={dMinVal} maxVal={dMaxVal}></RangeVis>
								</div>
							</div>
						)}
					</div>
				</div>
			)
		);
	});
}

export default EventStatsAND;

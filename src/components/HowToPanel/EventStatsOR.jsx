function EventStatsOR(props) {
	const { coverages, numActivity } = props;

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
					</div>
				</div>
			)
		);
	});
}

export default EventStatsOR;

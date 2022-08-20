import "./EventStatExplanation.css";

import Activity from "../../model/Activity";
import EventStat from "../../model/EventStat";

import RangeVis from "./RangeVis";

function EventStatExplanation(props) {
	const { stats, instances } = props;
	if (!stats || stats.length === 0) {
		return;
	}

	let activities = Activity.getActivityList(instances);
	const events = stats?.[0]?.events;
	let durationRanges = {};
	let coverages = {};
	let timeDistanceRanges = {};
    let timeDistances = {};
    let durations = {};
	if (events.length === 1) {
		for (const act of activities) {
			durationRanges[act] = EventStat.getStatsDurationRange(stats, act);
			coverages[act] = EventStat.getCoverageNums(stats, act);
            durations[act] = EventStat.getStatsDurations(stats, act);
		}
	} else if (events.length === 2) {
		for (const act of activities) {
			timeDistanceRanges[act] = EventStat.getStatsTimeDistanceRange(stats, act);
			coverages[act] = EventStat.getCoverageNums(stats, act);
            timeDistances[act] = EventStat.getStatsDurations(stats, act);
		}
	} else if (events.length > 2) {
		for (const act of activities) {
			coverages[act] = EventStat.getCoverageNums(stats, act);
		}
	}

	return (
		<div className="stats-container">
			{Object.keys(coverages).map((act) => {
				return (
					act !== "" &&
					parseInt(coverages[act]) !== 0 && (
						<div className="single-stat-container">
							<span className="stat-activity-title" style={{fontSize: 13, fontWeight: 600}}>{act}</span>
							<div className="stats">
								<div style={{ display: "flex", alignItems: "flex-end", columnGap: 10}}> 
									<span style={{height: 31}}>
                                        <span style={{fontSize: 12}}>Occurrance:{"  "}</span>
										<span style={{fontSize: 25, color: "var(--explanation)"}}> {coverages[act]}</span><span style={{fontSize: 12, marginLeft: "0.1em"}}> time(s)</span>
									</span>
								</div>
								{timeDistanceRanges[act] && (
									<div key={"td" + act} className="range-container" style={{ display: "flex", alignItems: "flex-end", columnGap: 10}}>
										<span style={{height: 31}}>
											<span style={{fontSize: 12}}>Time distance:{"  "}</span>
											<span style={{fontSize: 12}}>between{"  "}</span>
											<span style={{fontSize: 25, marginLeft: "0.1em", color: "var(--explanation)"}}>
												{Math.round(10 * parseFloat(timeDistanceRanges[act][0])) / 10}
											</span>
											<span style={{fontSize: 12, marginLeft: "0.3em"}}>and</span>
											<span style={{fontSize: 25, marginLeft: "0.1em", color: "var(--explanation)"}}>
												{Math.round(10 * parseFloat(timeDistanceRanges[act][1])) / 10}
											</span>
											<span style={{fontSize: 12, marginLeft: "0.1em"}}>  second(s)</span>
										</span>
                                        <div className="range-vis">
                                            <RangeVis numbers={timeDistances[act]}></RangeVis>
                                        </div>
									</div>
								)}
								{durationRanges[act]?.length > 0 && (
									<div key={"du" + act} className="range-container" style={{ display: "flex", alignItems: "flex-end", columnGap: 10 }}>
										<span style={{height: 31}}>
											<span style={{fontSize: 12}}>Duration:{"  "}</span>
											{durationRanges[act][0] !== durationRanges[act][1] && <span style={{fontSize: 12}}>between{"  "}</span>}
											<span style={{fontSize: 25, marginLeft: "0.1em", color: "var(--explanation)"}}>
												{Math.round(10 * parseFloat(durationRanges[act][0])) / 10}
											</span>
											{durationRanges[act][0] !== durationRanges[act][1] && <span style={{fontSize: 12, marginLeft: "0.3em"}}>and</span>}
											{durationRanges[act][0] !== durationRanges[act][1] && <span style={{fontSize: 25, marginLeft: "0.1em", color: "var(--explanation)"}}>
												{Math.round(10 * parseFloat(durationRanges[act][1])) / 10}
											</span>}
											<span style={{fontSize: 12, marginLeft: "0.1em"}}>  second(s)</span>
										</span>
                                        <div className="range-vis">
                                            <RangeVis numbers={durations[act]}></RangeVis>
                                        </div>
									</div>
                                        )}
							</div>
						</div>
					)
				);
			})}
		</div>
	);
}

export default EventStatExplanation;

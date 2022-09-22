import "./EventStatExplanation.css";

import Activity from "../../model/Activity";
import EventStat from "../../model/EventStat";

import EventStatsIconsAND from "./EventStatsIconsAND";
import EventStatsIconsOR from "./EventStatsIconsOR";
import EventStatsAND from "./EventStatsAND";
import EventStatsOR from "./EventStatsOR";

function EventStatExplanation(props) {
	const { stats, instances } = props;
	if (!stats || stats.length === 0) {
		return;
	}

	let activities = Activity.getActivityList(instances);
	const numActivity = Activity.getActivityNum(instances);
	const events = stats?.[0]?.events;
	let durationRanges = {};
	let coverages = {};
	let ORCoverages = {};
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
			timeDistances[act] = EventStat.getStatsTimeDistances(stats, act);
			ORCoverages[act] = EventStat.getORCoverageNum(stats, act);
		}
	} else if (events.length > 2) {
		for (const act of activities) {
			coverages[act] = EventStat.getCoverageNums(stats, act);
			ORCoverages[act] = EventStat.getORCoverageNum(stats, act);
		}
	}

	return (
		<div className="stats-container">
			<div id="AND-stats">
				<EventStatsIconsAND events={stats[0].events}></EventStatsIconsAND>
				<EventStatsAND
					coverages={coverages}
					timeDistanceRanges={timeDistanceRanges}
					numActivity={numActivity}
					durationRanges={durationRanges}
					timeDistances={timeDistances}
					durations={durations}
				></EventStatsAND>
			</div>
			{events.length > 1 && <hr id="divider" style={{ marginTop: 3, marginBottom: 3 }} />}
			{events.length > 1 && (
				<div id="OR-stats">
					<EventStatsIconsOR events={stats[0].events}></EventStatsIconsOR>
					<EventStatsOR coverages={ORCoverages} numActivity={numActivity}></EventStatsOR>
				</div>
			)}
		</div>
	);
}

export default EventStatExplanation;

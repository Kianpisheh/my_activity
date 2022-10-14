import "./EventStatExplanation.css";

import Activity from "../../model/Activity";
import EventStat from "../../model/EventStat";

import EventStatsIconsAND from "./EventStatsIconsAND";
import EventStatsIconsOR from "./EventStatsIconsOR";
import EventStatsAND from "./EventStatsAND";
import EventStatsOR from "./EventStatsOR";
import { logEvent } from "../../APICalls/activityAPICalls";

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
			coverages[act] = EventStat.getCoverage(stats, act);
			durations[act] = EventStat.getStatsDurations(stats, act);
		}
	} else if (events.length === 2) {
		for (const act of activities) {
			timeDistanceRanges[act] = EventStat.getStatsTimeDistanceRange(stats, act);
			coverages[act] = EventStat.getCoverage(stats, act);
			timeDistances[act] = EventStat.getStatsTimeDistances(stats, act);
			ORCoverages[act] = EventStat.getORCoverage(stats, act);
		}
	} else if (events.length > 2) {
		for (const act of activities) {
			coverages[act] = EventStat.getCoverage(stats, act);
			ORCoverages[act] = EventStat.getORCoverage(stats, act);
		}
	}

	logEvent(
		{
			coverageAND: coverages.length,
			coverageANDIdx: coverages,
			coverageOR: ORCoverages.length,
			coverageORIdx: ORCoverages,
			numActivity: numActivity,
			timeDistances: timeDistances,
			timeDistanceRanges: timeDistanceRanges,
			durations: durations,
			durationRanges: durationRanges,
		},
		"stats",
		"event_stats",
		props.dataset + "-" + props.user
	);

	return (
		<div className="stats-container">
			<div id="AND-stats">
				<EventStatsIconsAND
					events={stats[0].events}
					messageCallback={props.messageCallback}
				></EventStatsIconsAND>
				<EventStatsAND
					coverages={coverages}
					timeDistanceRanges={timeDistanceRanges}
					numActivity={numActivity}
					durationRanges={durationRanges}
					timeDistances={timeDistances}
					durations={durations}
					onWhyNotHover={props.onWhyNotHover}
					onTimeSliderChange={props.onTimeSliderChange}
					selectedInstanceEvents={props.selectedInstanceEvents}
					messageCallback={props.messageCallback}
					dataUser={props.dataset + "-" + props.user}
				></EventStatsAND>
			</div>
			{events.length > 1 && <hr id="divider" style={{ marginTop: 3, marginBottom: 3 }} />}
			{events.length > 1 && (
				<div id="OR-stats">
					<EventStatsIconsOR events={stats[0].events}></EventStatsIconsOR>
					<EventStatsOR
						coverages={ORCoverages}
						numActivity={numActivity}
						onWhyNotHover={props.onWhyNotHover}
						selectedInstanceEvents={props.selectedInstanceEvents}
						messageCallback={props.messageCallback}
					></EventStatsOR>
				</div>
			)}
		</div>
	);
}

export default EventStatExplanation;

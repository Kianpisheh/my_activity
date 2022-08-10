import ActivityInstance from "./ActivityInstance";

class EventStat {
	instanceType: string;
	instanceName: string;
	events: string[];
	hasEvents: boolean;
	durationRange: number[];
	timeDistanceRange: number[];
	immediateTimeDistance: number;

	constructor(activityInstance: ActivityInstance, events: string[]) {
		this.instanceType = activityInstance.getType();
		this.instanceName = activityInstance.getName();
		this.events = events;
		this.hasEvents = activityInstance.hasOccurred(this.events);
		if (this.hasEvents && events.length === 1) {
			this.durationRange = activityInstance.getDurationRange(this.events[0]);
		}
		if (this.hasEvents && events.length === 2) {
			this.timeDistanceRange = activityInstance.getTimeDistanceRange(this.events);
		}
	}

	static getEventInstanceStat(activityInstances: ActivityInstance[], events: string[]) {
		let stats: EventStat[] = [];
		for (const instance of activityInstances) {
			stats.push(new EventStat(instance, events));
		}

		return stats;
	}

	static getStatsTimeDistanceRange(stats: EventStat[], activity: string) {
		let minTimeDistances = [];
		let maxTimeDistances = [];
		for (const stat of stats) {
			if (stat.instanceType === activity) {
				if (stat.timeDistanceRange && stat.timeDistanceRange[0]) {
					minTimeDistances.push(stat.timeDistanceRange[0]);
				}
				if (stat.timeDistanceRange && stat.timeDistanceRange[1]) {
					maxTimeDistances.push(stat.timeDistanceRange[1]);
				}
			}
		}

		if (minTimeDistances.length === 0 && maxTimeDistances.length === 0) {
			return [];
		}
		return [Math.min(...minTimeDistances), Math.max(...maxTimeDistances)];
	}

	static getStatsDurationRange(stats: EventStat[], activity: string) {
		let minDurationRanges = [];
		let maxDurationRanges = [];
		for (const stat of stats) {
			if (stat.instanceType === activity) {
				if (stat.durationRange && stat.durationRange[0]) {
					minDurationRanges.push(stat.durationRange[0]);
				}
				if (stat.durationRange && stat.durationRange?.[1]) {
					maxDurationRanges.push(stat.durationRange[1]);
				}
			}
		}

		if (minDurationRanges.length === 0 && maxDurationRanges.length === 0) {
			return [];
		}
		return [Math.min(...minDurationRanges), Math.max(...maxDurationRanges)];
	}

	static getCoverageNums(stats: EventStat[], activity: string) {
		let coverage = 0;
		for (const stat of stats) {
			if (activity && stat.instanceType !== activity) {
				continue;
			}
			if (stat.hasEvents) {
				coverage += 1;
			}
		}

		return coverage;
	}
}

export default EventStat;

import ActivityInstance from "./ActivityInstance";

class EventStat {
	instanceType: string;
	instanceName: string;
	instanceIdx: number;
	events: string[];
	hasEvents: boolean;
	durationRange: number[];
	timeDistanceRange: number[];
	immediateTimeDistance: number;
	timeDistances: number[];
	durations: number[];
	ORSatisfiability: boolean;

	constructor(activityInstance: ActivityInstance, idx: number, events: string[]) {
		this.instanceType = activityInstance.getType();
		this.instanceName = activityInstance.getName();
		this.instanceIdx = idx;
		this.events = events;
		this.durations = [];
		this.timeDistances = [];
		this.durationRange = [];
		this.timeDistanceRange = [];
		this.ORSatisfiability = events.some((ev) => activityInstance.hasEvent(ev));

		this.hasEvents = activityInstance.hasOccurred(this.events);
		if (this.hasEvents && events.length === 1) {
			this.durations = activityInstance.getDurations(this.events[0]);
			this.durationRange = [Math.min(...this.durations), Math.max(...this.durations)];
		}
		if (this.hasEvents && events.length === 2) {
			this.timeDistances = activityInstance.getTimeDistances(this.events);
			this.timeDistanceRange = [Math.min(...this.timeDistances), Math.max(...this.timeDistances)];
		}
	}

	getInstanceIdx() {
		return this.instanceIdx;
	}

	getTimeDistances() {
		return this.timeDistances;
	}

	getDurations() {
		return this.durations;
	}

	static getEventInstanceStat(activityInstances: ActivityInstance[], events: string[]) {
		let stats: EventStat[] = [];
		for (let i = 0; i < activityInstances.length; i++) {
			stats.push(new EventStat(activityInstances[i], i, events));
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

	static getStatsDurations(stats: EventStat[], activity: string) {
		let durations = [];
		for (const stat of stats) {
			if (activity !== "") {
				if (activity && stat.instanceType !== activity) {
					continue;
				}
			}
			let tds: { [key: number]: number[] } = {};
			tds[stat.getInstanceIdx()] = stat.getDurations();
			durations.push(tds);
		}

		return durations;
	}

	static getStatsTimeDistances(stats: EventStat[], activity: string) {
		let timeDistances = [];
		for (const stat of stats) {
			if (activity && stat.instanceType !== activity) {
				continue;
			}
			let tds: { [key: number]: number[] } = {};
			tds[stat.getInstanceIdx()] = stat.getTimeDistances();
			timeDistances.push(tds);
		}

		return timeDistances;
	}

	static getCoverage(stats: EventStat[], activity: string) {
		let coverage = [];
		for (const stat of stats) {
			if (activity !== "") {
				if (activity && stat.instanceType !== activity) {
					continue;
				}
			}
			if (stat.hasEvents) {
				coverage.push(stat.instanceIdx);
			}
		}

		return coverage;
	}

	static getORCoverage(stats: EventStat[], activity: string) {
		let covertage = [];
		for (const stat of stats) {
			if (activity !== "") {
				if (activity && stat.instanceType !== activity) {
					continue;
				}
			}
			if (stat.ORSatisfiability) {
				covertage.push(stat.instanceIdx);
			}
		}

		return covertage;
	}
}

export default EventStat;

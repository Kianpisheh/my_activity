import ActivityInstance from "./ActivityInstance";

class EventStat {
	instanceType: string;
	instanceName: string;
	events: string[];
	numOccurrance1: number;
	numOccurrance2: number;
	avgDuration1: number;
	avgDuration2: number;
	avgTimeDistance: number;

	constructor(activityInstance: ActivityInstance, events: string[]) {
		this.instanceType = activityInstance.getType();
		this.instanceName = activityInstance.getName();
		this.events = events;
		this.avgDuration1 = activityInstance.getDuration(events[0]);
		this.avgDuration2 = activityInstance.getDuration(events[1]);
		this.numOccurrance1 = activityInstance.getEventNum(events[0]);
		this.numOccurrance2 = activityInstance.getEventNum(events[1]);
		this.avgTimeDistance = 0;
	}

	static getEventInstanceStat(activityInstances: ActivityInstance[], events: string[]) {
		let stats: EventStat[] = [];
		for (const instance of activityInstances) {
			stats.push(new EventStat(instance, events));
		}

		return stats;
	}

	static getAvgDuration(stats: EventStat[], activity: string) {
		let avgDurations1 = [];
		let avgDurations2 = [];
		for (const stat of stats) {
			if (activity && stat.instanceType !== activity) {
				continue;
			}
			if (stat.avgDuration1 !== 0) {
				avgDurations1.push(stat.avgDuration1);
			}
		}
		for (const stat of stats) {
			if (activity && stat.instanceType !== activity) {
				continue;
			}
			if (stat.avgDuration2 !== 0) {
				avgDurations2.push(stat.avgDuration2);
			}
		}

		let totalAvgDuration1 = avgDurations1.reduce((a, b) => a + b, 0);
		totalAvgDuration1 = totalAvgDuration1 / avgDurations1.length || 0;
		let totalAvgDuration2 = avgDurations2.reduce((a, b) => a + b, 0);
		totalAvgDuration2 = totalAvgDuration2 / avgDurations2.length || 0;

		return [totalAvgDuration1, totalAvgDuration2];
	}

	static getCoverageNums(stats: EventStat[], activity: string) {
		let coverage = [0, 0];
		for (const stat of stats) {
			if (activity && stat.instanceType !== activity) {
				continue;
			}
			if (stat.numOccurrance1 !== 0) {
				coverage[0] += 1;
			}
			if (stat.numOccurrance2 !== 0) {
				coverage[1] += 1;
			}
		}

		return coverage;
	}

	static getAvgNumOccurrances(stats: EventStat[], activity: string) {
		let avgNum = [0, 0];
		let num1 = 0;
		let num2 = 0;
		for (const stat of stats) {
			if (activity && stat.instanceType !== activity) {
				continue;
			}
			if (stat.numOccurrance1 !== 0) {
				avgNum[0] += stat.numOccurrance1;
				num1 += 1;
			}
			if (stat.numOccurrance2 !== 0) {
				avgNum[1] += stat.numOccurrance2;
				num2 += 1;
			}
		}

		return [avgNum[0] / num1 || 0, avgNum[1] / num2 || 0];
	}
}

export default EventStat;

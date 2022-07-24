import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import ActivityInstanceEvent from "../../model/ActivityInstanceEvent";
import AxiomTypes from "../../model/AxiomTypes";
import AxiomData from "../../model/AxiomData";
import AxiomStat from "../../model/AxiomStats";

import { subtractIntervals } from "./utils.js";

function handleInstanceSelection(idx: number, type: string, selectedInstances: { [type: string]: number[] }) {
	let new_selectedIdx = { ...selectedInstances };

	// only one type of result is allowed
	for (let tp of Object.keys(new_selectedIdx)) {
		if (tp !== type) {
			delete new_selectedIdx[tp];
		}
	}

	if (!new_selectedIdx[type]) {
		new_selectedIdx[type] = [];
	}

	if (new_selectedIdx[type].includes(idx)) {
		new_selectedIdx[type] = new_selectedIdx[type].filter((value) => value !== idx);
	} else {
		new_selectedIdx[type].push(idx);
	}

	return new_selectedIdx;
}

export function getUnsatisfiedAxioms(
	allActivityInstances: ActivityInstance[],
	instancesIdx: number[],
	activity: Activity
) {
	let allAxioms: { [type: string]: number[] } = {};
	for (const FNIdx of instancesIdx) {
		// for (const actInstance of activityInstances) {
		const actInstance = allActivityInstances[FNIdx];
		const axioms = actInstance.notSatisfied(activity);
		for (const ax of axioms) {
			if (allAxioms.hasOwnProperty(ax)) {
				allAxioms[ax].push(FNIdx);
			} else {
				allAxioms[ax] = [FNIdx];
			}
		}
	}

	return allAxioms;
}

export function handleWhyNotAxiomClick(
	actInstances: ActivityInstance[],
	instancesIdx: number[],
	axiom: string,
	TNInstancesIdx: number[]
) {
	let axiomChangeSuggestions: { [type: string]: any } = {};
	const axType = axiom.split(":")[0];

	if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomChangeSuggestions[AxiomTypes.AX_CHANGE_LIMIT_EXPANTION] = FNTimeDistanceExpantionHowTo(
			actInstances,
			instancesIdx,
			TNInstancesIdx,
			axiom
		);

		// find FN changes
		axiomChangeSuggestions[AxiomTypes.AX_CHANGE_TEMPORAL_REMOVAL] = FNTimeDistanceRemoveHowTo(
			actInstances,
			instancesIdx,
			TNInstancesIdx,
			axiom
		);
		return axiomChangeSuggestions;
	}
}

function classfyInstances(instances: ActivityInstance[], axiomString: string) {
	if (axiomString === "") {
		return [];
	}

	let outputIdx: number[] = [];
	const { axType, event1, event2, th1, th2 } = destrcutAxiomFromString(axiomString);

	// single event interaction axiom
	if (axType === AxiomTypes.TYPE_INTERACTION) {
		instances.forEach((instance, idx) => {
			if (instance.hasEvent(event1)) {
				outputIdx.push(idx);
			}
		});
	}

	// time-distance axiom
	if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		instances.forEach((instance, idx) => {
			if (instance.hasEvent(event1) && instance.hasEvent(event2)) {
				let evInstance1 = instance.getEvent(event1.toLowerCase());
				let evInstance2 = instance.getEvent(event2.toLowerCase());
				loop1: for (let i = 0; i < evInstance1.length; i++) {
					for (let j = 0; j < evInstance2.length; j++) {
						const timeDsitance = evInstance2[j].getStartTime() - evInstance2[i].getEndTime();
						if (timeDsitance < th2 && timeDsitance > th1) {
							outputIdx.push(idx);
							break loop1;
						}
					}
				}
			}
		});
	}

	// duration axiom
	if (axType === AxiomTypes.TYPE_DURATION) {
		instances.forEach((instance, idx) => {
			if (instance.hasEvent(event1) && instance.hasEvent(event2)) {
				let eventInstances: ActivityInstanceEvent[] = instance.getEvent(event1);
				for (const evInstance of eventInstances) {
					const evDuration = evInstance.getDuration();
					if (evDuration < th2 && evDuration > th1) {
						outputIdx.push(idx);
					}
				}
			}
		});
	}

	return outputIdx;
}

// axiom --> TN ??

// Assumption: only one axiom per axiom type
function FNTimeDistanceRemoveHowTo(
	actInstances: ActivityInstance[],
	instancesIdx: number[],
	TNInstancesIdx: number[],
	axiomString: string
) {
	let outputIdx = [];
	const { axType, event1, event2, th1, th2 } = destrcutAxiomFromString(axiomString);
	for (const idx of instancesIdx) {
		const instance = actInstances[idx];

		if (axType === AxiomTypes.TYPE_DURATION) {
			if (instance.getEvent(event1).length > 0) {
				outputIdx.push(idx);
			}
		} else if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			if (
				instance.getEvent(event1.toLowerCase()).length > 0 &&
				instance.getEvent(event2.toLowerCase()).length > 0
			) {
				outputIdx.push(idx);
			}
		}
	}

	let newFPs: number[] = classfyInstances(
		actInstances.filter((val, i) => TNInstancesIdx.includes(i)),
		axiomString
	);
	const newFPsActivityLabel = newFPs.filter((val) => actInstances[val].getType());

	return {
		axiom: axiomString,
		newTPs: outputIdx,
		th1: th1,
		th2: th2,
		newFPs: newFPs,
		newFPsLabel: newFPsActivityLabel,
	};
}

function FNTimeDistanceExpantionHowTo(
	actInstances: ActivityInstance[],
	instancesIdx: number[],
	TNInstancesIdx: number[],
	axiomString: string
) {
	const { axType, event1, event2, th1, th2 } = destrcutAxiomFromString(axiomString);
	let temporalDuration: { [idx: number]: number[] } = {};

	for (const idx of instancesIdx) {
		const instance = actInstances[idx];
		let eventInstances1: ActivityInstanceEvent[] = instance.getEvent(event1.toLowerCase());
		let eventInstances2: ActivityInstanceEvent[] = [];
		if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			eventInstances2 = instance.getEvent(event2.toLowerCase());
		}

		if (axType === AxiomTypes.TYPE_DURATION && !eventInstances1.length) {
			// object interaction is missing
			continue;
		}
		if (axType === AxiomTypes.TYPE_DURATION && (!eventInstances1.length || !eventInstances2.length)) {
			// object interaction is missing
			continue;
		}

		if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			for (let i = 0; i < eventInstances1.length; i++) {
				for (let j = 0; j < eventInstances2.length; j++) {
					const duration = eventInstances2[j].getStartTime() - eventInstances1[i].getEndTime();
					if (idx in temporalDuration) {
						temporalDuration[idx].push(duration);
					} else {
						temporalDuration[idx] = [duration];
					}
				}
			}
		} else if (axType === AxiomTypes.TYPE_DURATION) {
			for (let i = 0; i < eventInstances1.length; i++) {
				const duration = eventInstances1[i].getEndTime() - eventInstances1[i].getStartTime();
				if (idx in temporalDuration) {
					temporalDuration[idx].push(duration);
				} else {
					temporalDuration[idx] = [duration];
				}
			}
		}
	}

	// now find the th1 and th2 that satisfy the most num of instances
	let newTh1 = th1;
	let newTh2 = th2;
	let newSatisfiedInstIdx: number[] = [];
	let ss = 0;
	for (const idx in temporalDuration) {
		let distFromTh1 = [];
		let distFromTh2 = [];
		for (let i = 0; i < temporalDuration[idx].length; i++) {
			const t = temporalDuration[idx][i];
			if (t < 0) {
				continue;
			}
			ss = 0;
			if (newTh1 - t >= 0) {
				distFromTh1.push(newTh1 - t);
			} else {
				ss += 1;
			}
			if (t - newTh2 >= 0) {
				distFromTh2.push(t - newTh2);
			} else {
				ss += 1;
			}

			if (ss === 2) {
				break;
			}
		}
		if (ss === 2) {
			newSatisfiedInstIdx.push(+idx);
			continue;
		}

		if (!distFromTh1.length && !distFromTh2.length) {
			continue;
		}

		if (distFromTh1.length && Math.min(...distFromTh1) < Math.min(...distFromTh2)) {
			newTh1 = newTh1 - Math.min(...distFromTh1) - 1;
			newSatisfiedInstIdx.push(+idx);
		} else if (distFromTh2.length && Math.min(...distFromTh1) >= Math.min(...distFromTh2)) {
			newTh2 = newTh2 + Math.min(...distFromTh2) + 1;
			newSatisfiedInstIdx.push(+idx);
		}
	}

	// limit expanding does not work
	if (th1 === newTh1 && th2 === newTh2) {
		return {};
	}

	let newAxiomString = "";
	if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		let axTerms = axiomString.split(":");
		axTerms[3] = newTh1.toString();
		axTerms[4] = newTh2.toString();
		newAxiomString = axTerms.join(":");
	} else if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		let axTerms = axiomString.split(":");
		axTerms[2] = newTh1.toString();
		axTerms[3] = newTh2.toString();
		newAxiomString = axTerms.join(":");
	}

	let newFPsIdx: number[] = classfyInstances(
		actInstances.filter((val, i) => TNInstancesIdx.includes(i)),
		newAxiomString
	);

	const newFPsActivityLabel = newFPsIdx.filter((val) => actInstances[val].getType());

	return {
		th1: newTh1,
		th2: newTh2,
		newTPs: newSatisfiedInstIdx,
		axiom: axiomString,
		oldTh1: th1,
		oldTh2: th2,
		newAxiom: newAxiomString,
		newFPs: newFPsIdx,
		newFPsLabel: newFPsActivityLabel,
	};
}

function destrcutAxiomFromString(axiomString: string) {
	const axType = axiomString.split(":")[0];
	const event1: string = axiomString.split(":")[1];
	const event2: string = axiomString.split(":")[2];
	let th1: number = +axiomString.split(":")[3];
	let th2: number = +axiomString.split(":")[4]; // axType: time_distance
	if (axType === AxiomTypes.TYPE_DURATION) {
		th1 = +axiomString.split(":")[2];
		th2 = +axiomString.split(":")[3];
	}

	return { axType: axType, event1: event1, event2: event2, th1: th1, th2: th2 };
}

export function answerQuestion(
	questionType: string,
	instances: ActivityInstance[],
	activity: Activity,
	selectedInstancesIdx: { [resType: string]: number[] }
) {
	if (questionType === "why_not") {
		const unsAxioms = getUnsatisfiedAxioms(instances, selectedInstancesIdx["FN"], activity);
		return { data: unsAxioms, dType: "unsatisfied_axioms" };
	} else if (questionType === "why") {
		const axioms = activity.getAxioms();

		const FPAxiomStats = getAxiomStats(instances, axioms, selectedInstancesIdx["FP"]);
		return { data: FPAxiomStats, dType: "axiom_stats" };
	}
}

export function handleWhyQuery(
	instances: ActivityInstance[],
	activity: Activity,
	selectedInstancesIdx: { [resType: string]: number[] },
	classificationResult: { [type: string]: any }
) {
	const axioms = activity.getAxioms();
	const FPAxiomStats = getAxiomStats(instances, axioms, selectedInstancesIdx["FP"]);
	const TPAxiomStats = getAxiomStats(instances, axioms, classificationResult["TP"]);

	for (let i = 1; i < axioms.length; i++) {
		const temporalLimits = getWhyHowToSuggestions(FPAxiomStats, TPAxiomStats, axioms[i]);
	}
}

function getAxiomStats(instances: ActivityInstance[], axioms: AxiomData[], selectedIdx: number[]) {
	let stats: { [idx: number]: AxiomStat } = {};

	let j = 0;
	for (const ax of axioms) {
		let i = 0;
		let axiomStat: AxiomStat = new AxiomStat(ax.events);
		for (const idx of selectedIdx) {
			const stat = instances[idx].getStat(ax);
			if (i === 0) {
				axiomStat = stat;
			} else {
				axiomStat = axiomStat.merge(stat);
			}
			i += 1;
		}
		stats[j] = axiomStat;
		j += 1;
	}

	return stats;
}

function getWhyHowToSuggestions(
	FPAxiomStat: { [axIdx: number]: AxiomStat },
	TPAxiomStat: { [axIdx: number]: AxiomStat },
	axiom: AxiomData
) {
	let suggestions: { [type: string]: any } = {};
	// remove all FPs
	let newInterval = [];
	const axType = axiom.getType();

	let tfp1, ttp1;
	let tfp2, ttp2;

	for (let i = 1; i < 2; i++) {
		if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			tfp1 = FPAxiomStat[i].minTimeDistance;
			tfp2 = FPAxiomStat[i].maxTimeDistance;
			if (TPAxiomStat) {
				ttp1 = TPAxiomStat[i].minTimeDistance;
				ttp2 = TPAxiomStat[i].maxTimeDistance;
			}
		} else if (axType === AxiomTypes.TYPE_DURATION) {
			tfp1 = FPAxiomStat[i].minDuration1;
			tfp2 = FPAxiomStat[i].maxDuration1;
			if (TPAxiomStat) {
				ttp1 = TPAxiomStat[i].minDuration1;
				ttp2 = TPAxiomStat[i].maxDuration1;
			}
		}

		newInterval = subtractIntervals(axiom.getTh1(), axiom.getTh2(), tfp1, tfp2);
		suggestions["FP0"] = [...newInterval];

        // FN_SAME suggestion
		let newFPInterval = subtractIntervals(tfp1, tfp2, ttp1, ttp2);
        if (newFPInterval.length === 0) {
            continue;
        }
		if (newFPInterval.length) {
			newInterval = subtractIntervals(axiom.getTh1(), axiom.getTh2(), newFPInterval[0][0], newFPInterval[0][1]);
		}
		if (newFPInterval.length === 2) {
			newInterval = newInterval.concat(
				subtractIntervals(axiom.getTh1(), axiom.getTh2(), newFPInterval[1][0], newFPInterval[1][1])
			);
		}
		if (newInterval.length === 4) {
			newInterval.splice(1, 2);
			newInterval.push([ttp1, ttp2]);
		}
        if (newInterval.length) {
		    suggestions["FN_SMAE"] = [...newInterval];
        }
	}
	return newInterval;
}

export default handleInstanceSelection;

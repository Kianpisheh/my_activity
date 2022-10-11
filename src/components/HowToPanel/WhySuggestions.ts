import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import AxiomData from "../../model/AxiomData";
import AxiomStat from "../../model/AxiomStats";
import AxiomTypes from "../../model/AxiomTypes";
import HowToAxiom from "../../model/HowToAxiom";

import { subtractIntervals } from "../ResultsPanel/utils.js";
import isEqual from "lodash.isequal";
import RuleitemData from "../../model/RuleitemData";
import { updateClassificationResults } from "../../Classification";

import sortBy from "lodash/sortBy";

export function getWhyHowToSuggestions(
	selectedFPs: number[],
	axiom: AxiomData,
	axIdx: number,
	currentActivity: Activity,
	classificationResult: { [resType: string]: any },
	instances: ActivityInstance[],
	ruleitems: RuleitemData[],
	activities: Activity[]
): HowToAxiom[] {
	const axType = axiom.getType();

	let suggestions: HowToAxiom[] = [];

	if (axType === AxiomTypes.TYPE_DURATION || axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		const suggestions1 = getFP0TimeContractionSuggestion(
			axiom,
			0,
			currentActivity,
			selectedFPs,
			classificationResult,
			instances,
			[...activities]
		);

		const suggestions2 = getFNSameTimeContractionSuggestion(
			axiom,
			0,
			currentActivity,
			selectedFPs,
			classificationResult,
			instances,
			[...activities]
		);

		suggestions = suggestions2.concat(suggestions1);
	} else if (axType === AxiomTypes.TYPE_INTERACTION) {
		const suggestion3 = getInteractionAdditionAxiomSuggestions(
			axiom,
			ruleitems,
			classificationResult,
			currentActivity,
			instances,
			selectedFPs,
			[...activities],
			"FP"
		);
		suggestions = suggestion3;
		//const suggestion4 = getNewDurationAxiom([...activities], currentActivity, instances);
	}

	const suggestions5 = getInteractionORAxiom(
		[...activities],
		currentActivity,
		instances,
		selectedFPs,
		classificationResult,
		-1
	);

	suggestions = suggestions.concat(suggestions5);

	//suggestions = checkDuplicate(suggestions);

	return suggestions;
}

function getInteractionORAxiom(
	activities: Activity[],
	currentActivity: Activity,
	instances: ActivityInstance[],
	selectedFPs: number[],
	classificationResult: { [resType: string]: any },
	TPNumTh: number
) {
	const targetInstances = instances.filter((instance) => instance.getType() === currentActivity.getName());
	const selectedInstances = selectedFPs.map((idx) => instances[idx]);
	let targetInstancesEventsUnion = targetInstances.map((instance) => instance.getUniqueEvents()).flat();

	let selectedFPInstancesEventsUnion: string[] = [];
	for (let i = 0; i < selectedInstances.length; i++) {
		selectedFPInstancesEventsUnion = selectedFPInstancesEventsUnion.concat(
			selectedInstances[i].getUniqueEvents().flat()
		);
	}

	selectedFPInstancesEventsUnion = [...new Set(selectedFPInstancesEventsUnion)];

	// const exclusiveTargetInstancesEventsUnion = targetInstancesEventsUnion.filter(
	// 	(ev) => !selectedFPInstancesEventsUnion.includes(ev)
	// );

	const exclusiveTargetInstancesEventsUnion = [...targetInstancesEventsUnion];

	let exclusiveTargetInstancesEventsUnionCount: { [ev: string]: number } = {};
	for (const ev of exclusiveTargetInstancesEventsUnion) {
		exclusiveTargetInstancesEventsUnionCount[ev] = exclusiveTargetInstancesEventsUnionCount[ev]
			? exclusiveTargetInstancesEventsUnionCount[ev] + 1
			: 1;
	}

	// target samples event coverage
	let eventCoverage: { [ev: string]: number[] } = {};
	for (const ev of exclusiveTargetInstancesEventsUnion) {
		for (let i = 0; i < instances.length; i++) {
			const instance = instances[i];
			if (instance.getType() === currentActivity.getName() && instance.hasEvent(ev)) {
				if (eventCoverage[ev] && !eventCoverage[ev].includes(i)) {
					eventCoverage[ev].push(i);
				} else {
					eventCoverage[ev] = [i];
				}
			}
		}
	}

	// find Logical OR events
	let OREvents = [];
	for (let i = 0; i < Object.keys(exclusiveTargetInstancesEventsUnionCount).length; i++) {
		for (let j = i + 1; j < Object.keys(exclusiveTargetInstancesEventsUnionCount).length; j++) {
			const ev1 = Object.keys(exclusiveTargetInstancesEventsUnionCount)[i];
			const ev2 = Object.keys(exclusiveTargetInstancesEventsUnionCount)[j];
			const cnt1 = exclusiveTargetInstancesEventsUnionCount[ev1];
			const cnt2 = exclusiveTargetInstancesEventsUnionCount[ev2];
			if (TPNumTh === -1) {
				TPNumTh = targetInstances.length;
			}
			if (cnt1 + cnt2 >= TPNumTh) {
				let union = new Set(eventCoverage[ev1].concat(eventCoverage[ev2]));
				if (union.size >= TPNumTh) {
					OREvents.push([ev1, ev2]);
				}
			}
		}
	}

	// craete the the suggestions objects
	let suggestions = [];
	let improvments = [];
	for (let i = 0; i < OREvents.length; i++) {
		const axiom = new AxiomData({ type: AxiomTypes.TYPE_OR_INTERACTION, events: OREvents[i], th1: -1, th2: -1 });
		const newAxiomSet = currentActivity.getAxioms().concat([axiom]);

		const whatIfRes = updateClassificationResults(
			classificationResult,
			currentActivity,
			axiom,
			newAxiomSet,
			instances,
			[...activities]
		);

		// any improvements?
		const improvement = selectedFPs.filter(
			(idx) => !whatIfRes["newFPs"][currentActivity.getName()]?.["all"]?.includes(idx)
		);
		if (!improvement.length) {
			continue;
		}

		// sort based on the improvement
		improvments.push({ i: improvement.length });
		suggestions.push(
			new HowToAxiom(
				"interaction_or",
				axiom,
				0,
				null,
				"FN_SAME",
				JSON.parse(JSON.stringify(whatIfRes["newTPs"])),
				JSON.parse(JSON.stringify(whatIfRes["newFPs"]))
			)
		);
	}

	let rankedSuggestions: HowToAxiom[] = [];
	if (suggestions[0]) {
		rankedSuggestions = [suggestions[0]];
	}

	for (let i = 1; i < suggestions.length; i++) {
		const imp = Object.values(improvments[i])[0];
		for (let j = 0; j < rankedSuggestions.length; j++) {
			const improvement = selectedFPs.filter(
				(idx) => !rankedSuggestions[j]["newFPs"][currentActivity.getName()]?.["all"]?.includes(idx)
			);
			if (imp >= improvement.length) {
				rankedSuggestions.splice(j, 0, suggestions[i]);
				break;
			}
		}
	}

	return rankedSuggestions;
}

export function getAxiomStats(instances: ActivityInstance[], axiom: AxiomData) {
	let stats: AxiomStat = null;

	let i = 0;
	let axiomStat: AxiomStat = new AxiomStat(axiom.events);
	for (const instance of instances) {
		const stat = instance.getStat(axiom);
		if (i === 0) {
			axiomStat = stat;
		} else {
			axiomStat = axiomStat.merge(stat);
		}
		i += 1;
	}
	stats = axiomStat;
	return stats;
}

function getFP0TimeContractionSuggestion(
	axiom: AxiomData,
	axiomIdx: number,
	currentActivity: Activity,
	selectedFPs: number[],
	classificationResult: { [resType: string]: any },
	actInstances: ActivityInstance[],
	activities: Activity[]
) {
	const TPs = classificationResult?.[currentActivity.getName()]["TP"];
	// 1. find temporal statistics of the axiom if applicable (Why)
	const FPInstances = actInstances.filter((val, i) => selectedFPs.includes(i));
	const FPAxiomStat = getAxiomStats(FPInstances, axiom);
	const TPInstances = actInstances.filter((val, i) => TPs.includes(i));
	const TPAxiomStat = getAxiomStats(TPInstances, axiom);

	// 2. find axiom suggestions (HowTo)
	let suggestions: HowToAxiom[] = [];
	// remove all FPs
	const axType = axiom.getType();

	let tfp1, ttp1;
	let tfp2, ttp2;

	if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		tfp1 = FPAxiomStat.minTimeDistance;
		tfp2 = FPAxiomStat.maxTimeDistance;
		if (TPAxiomStat) {
			ttp1 = TPAxiomStat.minTimeDistance;
			ttp2 = TPAxiomStat.maxTimeDistance;
		}
	} else if (axType === AxiomTypes.TYPE_DURATION) {
		tfp1 = FPAxiomStat.minDuration1;
		tfp2 = FPAxiomStat.maxDuration1;
		if (TPAxiomStat) {
			ttp1 = TPAxiomStat.minDuration1;
			ttp2 = TPAxiomStat.maxDuration1;
		}
	}

	// FP0 suggestions
	let newIntervals = subtractIntervals(axiom.getTh1(), axiom.getTh2(), tfp1, tfp2);
	newIntervals.forEach((interval: number[]) => {
		const newAxiom = new AxiomData({
			events: axiom.getEvents(),
			type: axiom.getType(),
			th1: interval[0],
			th2: interval[1],
		});

		// new axiom has replaced the old one
		let newAxiomSet = [...currentActivity.getAxioms()];
		for (let j = 0; j < newAxiomSet.length; j++) {
			if (isEqual(newAxiomSet[j], axiom)) {
				newAxiomSet[j] = newAxiom;
			}
		}

		const whatIfRes = updateClassificationResults(
			classificationResult,
			currentActivity,
			axiom,
			newAxiomSet,
			actInstances,
			[...activities]
		);

		suggestions.push(
			new HowToAxiom(
				"time_contraction",
				axiom,
				Number(Object.keys(FPAxiomStat)[0]),
				interval,
				"FP0",
				whatIfRes["newTPs"],
				whatIfRes["newFPs"]
			)
		);
	});

	return suggestions;
}

function getFNSameTimeContractionSuggestion(
	axiom: AxiomData,
	axiomIdx: number,
	currentActivity: Activity,
	selectedFPs: number[],
	classificationResult: { [resType: string]: any },
	actInstances: ActivityInstance[],
	activities: Activity[]
) {
	const TPs = classificationResult?.[currentActivity.getName()]["TP"];
	// 1. find temporal statistics of the axiom if applicable (Why)
	const FPInstances = actInstances.filter((val, i) => selectedFPs.includes(i));
	const FPAxiomStat = getAxiomStats(FPInstances, axiom);
	const TPInstances = actInstances.filter((val, i) => TPs.includes(i));
	const TPAxiomStat = getAxiomStats(TPInstances, axiom);

	// 2. find axiom suggestions (HowTo)
	let suggestions: HowToAxiom[] = [];
	// remove all FPs
	let newInterval = [];
	const axType = axiom.getType();

	let tfp1, ttp1;
	let tfp2, ttp2;

	if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
		tfp1 = FPAxiomStat.minTimeDistance;
		tfp2 = FPAxiomStat.maxTimeDistance;
		if (TPAxiomStat) {
			ttp1 = TPAxiomStat.minTimeDistance;
			ttp2 = TPAxiomStat.maxTimeDistance;
		}
	} else if (axType === AxiomTypes.TYPE_DURATION) {
		tfp1 = FPAxiomStat.minDuration1;
		tfp2 = FPAxiomStat.maxDuration1;
		if (TPAxiomStat) {
			ttp1 = TPAxiomStat.minDuration1;
			ttp2 = TPAxiomStat.maxDuration1;
		}
	}

	// FN_SAME suggestion
	let newFPInterval = subtractIntervals(tfp1, tfp2, ttp1, ttp2);
	if (newFPInterval.length === 0) {
		return suggestions;
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

	// find new TPs and new FPs
	if (newInterval.length) {
		newInterval.forEach((interval: number[]) => {
			const newAxiom = new AxiomData({
				events: axiom.getEvents(),
				type: axiom.getType(),
				th1: interval[0],
				th2: interval[1],
			});

			// new axiom has replaced the old one
			let newAxiomSet = [...currentActivity.getAxioms()];
			for (let j = 0; j < newAxiomSet.length; j++) {
				if (isEqual(newAxiomSet[j], axiom)) {
					if (newAxiom) {
						newAxiomSet[j] = newAxiom;
					} else {
						newAxiomSet.splice(j, 1);
						break;
					}
				}
			}

			const whatIfRes = updateClassificationResults(
				classificationResult,
				currentActivity,
				axiom,
				newAxiomSet,
				actInstances,
				[...activities]
			);

			suggestions.push(
				new HowToAxiom(
					"time_contraction",
					axiom,
					0,
					interval,
					"FN_SAME",
					whatIfRes["newTPs"],
					whatIfRes["newFPs"]
				)
			);
		});
	}

	return suggestions;
}

export function getNewDurationAxiom(activities: Activity[], currentActivity: Activity, instances: ActivityInstance[]) {
	if (!currentActivity) {
		return;
	}
	const candidateEvents = currentActivity.getEvents();
	let targetActivityMins = [];
	let targetActivityMaxs = [];
	let otherActivitiesMins = [];
	let otherActivitiesMaxs = [];
	for (const candidateEvent of candidateEvents) {
		for (const instance of instances) {
			const durations = instance.getDurations(candidateEvent);
			if (durations.length === 0) {
				continue;
			}
			if (instance.getType() === currentActivity.getName()) {
				targetActivityMaxs.push(Math.max(...durations));
				targetActivityMins.push(Math.min(...durations));
			} else {
				otherActivitiesMaxs.push(Math.max(...durations));
				otherActivitiesMins.push(Math.min(...durations));
			}
		}
	}
	let x = 1;
}

function checkDuplicate(suggestions: HowToAxiom[]) {
	let uniqueSuggestions: HowToAxiom[] = [];
	loop: for (let i = 0; i < suggestions.length; i++) {
		for (let j = i - 1; j >= 0; j--) {
			if (suggestions[i].suggestedAxiomData[0] === suggestions[j].suggestedAxiomData[0]) {
				if (suggestions[i].suggestedAxiomData[1] === suggestions[j].suggestedAxiomData[1]) {
					if (suggestions[i].type === suggestions[j].type) {
						break loop;
					}
				}
			}
		}
		uniqueSuggestions.push(suggestions[i]);
	}

	return uniqueSuggestions;
}

export function getInteractionAdditionAxiomSuggestions(
	axiom: AxiomData,
	ruleitems: RuleitemData[],
	classificationResult: { [type: string]: any },
	currentActivity: Activity,
	instances: ActivityInstance[],
	selectedInstances: number[],
	activities: Activity[],
	instanceType: string
) {
	const SUPP_TH = 0.75;
	const CONF_TH = 0.5;
	const activityNum = ActivityInstance.getNum(currentActivity.getName(), instances);
	let candidateRuleitems: RuleitemData[] = [];

	// find the eligible (high supp and conf) candidates
	for (const ruleitem of ruleitems) {
		if (ruleitem.getConf() >= CONF_TH && ruleitem.getSupp() / activityNum >= SUPP_TH) {
			candidateRuleitems.push(ruleitem);
		}
	}

	// remove subset rule items
	let candidateRuleitems2: RuleitemData[] = [];
	loop1: for (let i = 0; i < candidateRuleitems.length; i++) {
		const items1 = candidateRuleitems[i].getItems();
		for (let j = 0; j < candidateRuleitems.length; j++) {
			if (i === j) continue;
			const items2 = candidateRuleitems[j].getItems();
			if (items1.every((val) => items2.includes(val))) {
				continue loop1;
			}
		}
		candidateRuleitems2.push(candidateRuleitems[i]);
	}

	// rank ruleitems
	candidateRuleitems2 = sortBy(candidateRuleitems2, [
		function (rItem: RuleitemData) {
			return rItem.getItems().length;
		},
		"supp",
		"conf",
	]);
	candidateRuleitems2 = candidateRuleitems2.reverse();

	// now create the suggestions
	let suggestions = [];
	const timeTiedEvents = currentActivity.getTimeTiedEvents();
	for (const ruleitem of candidateRuleitems2.slice(0, 30)) {
		// check if current items is a subset of the ruleitmes
		const isSubset = timeTiedEvents.every((ev) => ruleitem.items.includes(ev));
		if (!isSubset) {
			continue;
		}

		// new axiom has replaced the old one
		let newAxiomSet = [...currentActivity.getAxioms()];
		// remove the curr interaction axiom
		newAxiomSet = newAxiomSet.filter((axiom) => axiom.getType() !== AxiomTypes.TYPE_INTERACTION);
		// replace the newAxiom with the old one
		let newItems = ruleitem.getItems().map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase());
		let newAxiom = new AxiomData({ type: AxiomTypes.TYPE_INTERACTION, events: newItems, th1: -1, th2: -1 });
		newAxiomSet.push(newAxiom);

		const whatIfRes = updateClassificationResults(
			classificationResult,
			currentActivity,
			axiom,
			newAxiomSet,
			instances,
			[...activities]
		);

		// check if it removes any of the selected FPs or FNs
		if (instanceType === "FP") {
			if (
				selectedInstances.every((fpIdx) =>
					whatIfRes["newFPs"]?.[currentActivity.getName()]?.["all"]?.includes(fpIdx)
				)
			) {
				continue;
			}
		} else if (instanceType === "FN") {
			if (
				selectedInstances.every((fnIdx) => !whatIfRes["newTPs"]?.[currentActivity.getName()]?.includes(fnIdx))
			) {
				continue;
			}
		}

		suggestions.push(
			new HowToAxiom(
				"interaction_addition",
				newAxiom,
				0,
				null,
				"FP_MIN",
				whatIfRes["newTPs"],
				whatIfRes["newFPs"]
			)
		);
	}

	// rank suggestions based on their improvements

	return suggestions;
}

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

import cloneDeep from "lodash/cloneDeep";

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
	} else if (axType === axiom.getType()) {
		const suggestion3 = getInteractionAdditionAxiomSuggestions(
			axiom,
			ruleitems[currentActivity.getName()],
			classificationResult,
			currentActivity,
			instances,
			selectedFPs
		);
		suggestions = suggestion3;
	}

	suggestions = checkDuplicate(suggestions);

	return suggestions;
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
			newAxiom,
			actInstances,
			[...activities]
		);
		// // new TPs
		// const oldTPFNs = classificationResult?.[currentActivity.getName()]["FN"].concat(
		// 	classificationResult?.[currentActivity.getName()]["TP"]
		// );
		// let oldFNTPInstances = [];
		// for (let k = 0; k < oldTPFNs.length; k++) {
		// 	oldFNTPInstances.push(actInstances[oldTPFNs[k]]);
		// }
		// let newTPs: number[] = [];
		// for (let i = 0; i < oldFNTPInstances.length; i++) {
		// 	if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
		// 		newTPs.push(oldTPFNs[i]);
		// 	}
		// }
		// // new FPs
		// const oldTNFPs = classificationResult?.[currentActivity.getName()]["TN"].concat(
		// 	classificationResult?.[currentActivity.getName()]["FP"]["all"]
		// );
		// let oldTNFPInstances = [];
		// for (let k = 0; k < oldTNFPs.length; k++) {
		// 	oldTNFPInstances.push(actInstances[oldTNFPs[k]]);
		// }
		// let newFPs: number[] = [];
		// for (let i = 0; i < oldTNFPInstances.length; i++) {
		// 	if (oldTNFPInstances[i].isSatisfied(newAxiomSet)) {
		// 		newFPs.push(oldTNFPs[i]);
		// 	}
		// }

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

			const whatIfRes = updateClassificationResults(
				classificationResult,
				currentActivity,
				axiom,
				newAxiom,
				actInstances,
				[...activities]
			);
			// // new axiom has replaced the old one
			// let newAxiomSet = [...currentActivity.getAxioms()];
			// for (let j = 0; j < newAxiomSet.length; j++) {
			// 	if (isEqual(newAxiomSet[j], axiom)) {
			// 		newAxiomSet[j] = newAxiom;
			// 	}
			// }

			// // new TPs
			// const oldTPFNs = classificationResult?.[currentActivity.getName()]["FN"].concat(
			// 	classificationResult?.[currentActivity.getName()]["TP"]
			// );
			// let oldFNTPInstances = [];
			// for (let k = 0; k < oldTPFNs.length; k++) {
			// 	oldFNTPInstances.push(actInstances[oldTPFNs[k]]);
			// }
			// let newTPs: number[] = [];
			// for (let i = 0; i < oldFNTPInstances.length; i++) {
			// 	if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
			// 		newTPs.push(oldTPFNs[i]);
			// 	}
			// }
			// // new FPs
			// const oldTNFPs = classificationResult?.[currentActivity.getName()]["TN"].concat(
			// 	classificationResult?.[currentActivity.getName()]["FP"]["all"]
			// );
			// let oldTNFPInstances = [];
			// for (let k = 0; k < oldTNFPs.length; k++) {
			// 	oldTNFPInstances.push(actInstances[oldTNFPs[k]]);
			// }
			// let newFPs: number[] = [];
			// for (let i = 0; i < oldTNFPInstances.length; i++) {
			// 	if (oldTNFPInstances[i].isSatisfied(newAxiomSet)) {
			// 		newFPs.push(oldTNFPs[i]);
			// 	}
			// }

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

function getInteractionAdditionAxiomSuggestions(
	axiom: AxiomData,
	ruleitems: RuleitemData[],
	classificationResult: { [type: string]: any },
	currentActivity: Activity,
	instances: ActivityInstance[],
	selectedFPs: number[]
) {
	const SUPP_TH = 0.85;
	const CONF_TH = 0.9;
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
	for (const ruleitem of candidateRuleitems2.slice(0, 3)) {
		// new axiom has replaced the old one
		let newAxiomSet = [...currentActivity.getAxioms()];
		// remove the curr interaction axiom
		newAxiomSet.filter((axiom) => axiom.getType() !== AxiomTypes.TYPE_INTERACTION);
		// replace the newAxiom with the old one
		let newItems = ruleitem.getItems().map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase());
		let newAxiom = new AxiomData({ type: AxiomTypes.TYPE_INTERACTION, events: newItems, th1: -1, th2: -1 });
		newAxiomSet.push(newAxiom);

		// new TPs
		const oldTPFNs = classificationResult?.[currentActivity.getName()]["FN"].concat(
			classificationResult?.[currentActivity.getName()]["TP"]
		);
		let oldFNTPInstances = [];
		for (let k = 0; k < oldTPFNs.length; k++) {
			oldFNTPInstances.push(instances[oldTPFNs[k]]);
		}
		let newTPs: number[] = [];
		for (let i = 0; i < oldFNTPInstances.length; i++) {
			if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
				newTPs.push(oldTPFNs[i]);
			}
		}
		// new FPs
		const oldTNFPs = classificationResult?.[currentActivity.getName()]["TN"].concat(
			classificationResult?.[currentActivity.getName()]["FP"]["all"]
		);
		let oldTNFPInstances = instances.filter((val, idx) => oldTNFPs.includes(idx));
		let newFPs: number[] = [];
		for (let i = 0; i < oldTNFPInstances.length; i++) {
			if (oldTNFPInstances[i].isSatisfied(newAxiomSet)) {
				newFPs.push(oldTNFPs[i]);
			}
		}

		suggestions.push(new HowToAxiom("interaction_addition", newAxiom, 0, null, "FP_MIN", [...newTPs], [...newFPs]));
	}

	return suggestions;
}

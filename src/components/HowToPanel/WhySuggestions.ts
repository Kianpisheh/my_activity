import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import AxiomData from "../../model/AxiomData";
import AxiomStat from "../../model/AxiomStats";
import AxiomTypes from "../../model/AxiomTypes";
import HowToAxiom from "../../model/HowToAxiom";

import { subtractIntervals } from "../ExplanationPanel/utils.js";

export function getWhyHowToSuggestions(
	selectedFPs: number[],
	axiom: AxiomData,
	axIdx: number,
	currentActivity: Activity,
	classificationResult: { [resType: string]: any },
	instances: ActivityInstance[]
): HowToAxiom[] {
	const TPs = classificationResult["TP"];
	// 1. find temporal statistics of the axiom if applicable (Why)
	const FPInstances = instances.filter((val, i) => selectedFPs.includes(i));
	const FPAxiomStat = getAxiomStats(FPInstances, axiom);
    const TPInstances = instances.filter((val, i) => TPs.includes(i));
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
		newAxiomSet[axIdx] = newAxiom;

		const oldTPs = classificationResult["TP"];
		let oldTPInstances = instances.filter((val, idx) => oldTPs.includes(idx));
		let newTPs: number[] = [];
		for (let i = 0; i < oldTPInstances.length; i++) {
			if (oldTPInstances[i].isSatisfied(newAxiomSet)) {
				newTPs.push(oldTPs[i]);
			}
		}
		suggestions.push(
			new HowToAxiom("time_contraction", axiom, Number(Object.keys(FPAxiomStat)[0]), interval, "FP0", newTPs, [])
		);
	});

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
		newIntervals.forEach((interval: number[]) => {
			const newAxiom = new AxiomData({
				events: axiom.getEvents(),
				type: axiom.getType(),
				th1: interval[0],
				th2: interval[1],
			});

			// new axiom has replaced the old one
			let newAxiomSet = [...currentActivity.getAxioms()];
			newAxiomSet[axIdx] = newAxiom;

			// new TPs
			const oldFNs = classificationResult["FN"];
			let oldFNInstances = instances.filter((val, idx) => oldFNs.includes(idx));
			let newTPs: number[] = [];
			for (let i = 0; i < oldFNInstances.length; i++) {
				if (oldFNInstances[i].isSatisfied(newAxiomSet)) {
					newTPs.push(oldFNs[i]);
				}
			}
			// new FPs
			const oldTNs = classificationResult["TN"];
			let oldTNInstances = instances.filter((val, idx) => oldTNs.includes(idx));
			let newFPs: number[] = [];
			for (let i = 0; i < oldTNInstances.length; i++) {
				if (oldTNInstances[i].isSatisfied(newAxiomSet)) {
					newFPs.push(oldTNs[i]);
				}
			}
			suggestions.push(
				new HowToAxiom(
					"time_contraction",
					axiom,
					axIdx,
					interval,
					"FN_SAME",
					newTPs,
					newFPs
				)
			);
		});
	}
    
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

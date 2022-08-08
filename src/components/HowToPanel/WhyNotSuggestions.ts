import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import ActivityInstanceEvent from "../../model/ActivityInstanceEvent";
import AxiomData from "../../model/AxiomData";
import AxiomTypes from "../../model/AxiomTypes";
import HowToAxiom from "../../model/HowToAxiom";

import isEqual from "lodash.isequal";

export function getWhyNotHowToSuggestions(
	axiom: AxiomData,
	axiomIdx: number,
	currentActivity: Activity,
	selectedFNs: number[],
	classificationResult: { [resType: string]: any },
	instances: ActivityInstance[]
): HowToAxiom[] {
	// 2. find axiom suggestions (HowTo)
	let suggestions: HowToAxiom[] = [];
	const axType = axiom.getType();
	if (axType === AxiomTypes.TYPE_TIME_DISTANCE || axType === AxiomTypes.TYPE_DURATION) {
		const suggestion1 = getTimeExpansionSuggestion(
			axiom,
			axiomIdx,
			currentActivity,
			selectedFNs,
			classificationResult,
			instances
		);
		if (suggestion1) {
			suggestions.push(suggestion1);
		}
		const suggestion2 = getTempAxiomRemovalSuggestion(
			axiom,
			axiomIdx,
			currentActivity,
			selectedFNs,
			classificationResult,
			instances
		);
		if (suggestion2) {
			suggestions.push(suggestion2);
		}
	} else if (axType === AxiomTypes.TYPE_INTERACTION) {
		const suggestion = getInteractionAxiomRemovalSuggestion(
			axiom,
			axiomIdx,
			currentActivity,
			selectedFNs,
			classificationResult,
			instances
		);
		if (suggestion) {
			suggestions.push(suggestion);
		}
	}

	return suggestions;

	// Assumption: only one axiom per axiom type
	function getTempAxiomRemovalSuggestion(
		axiom: AxiomData,
		axiomIdx: number,
		currentActivity: Activity,
		selectedFNs: number[],
		classificationResult: { [resType: string]: any },
		actInstances: ActivityInstance[]
	): HowToAxiom {
		const th1 = axiom.getTh1();
		const th2 = axiom.getTh2();

		// remove the unsatisfied axiom
		let newAxiomSet = [...currentActivity.getAxioms()];
		for (let j = 0; j < newAxiomSet.length; j++) {
			if (isEqual(newAxiomSet[j], axiom)) {
				newAxiomSet.splice(j, 1);
				break;
			}
		}

		// new TPs
		const oldTPFNs = classificationResult["FN"].concat(classificationResult["TP"]);
		let oldFNTPInstances = [];
		for (let k = 0; k < oldTPFNs.length; k++) {
			oldFNTPInstances.push(actInstances[oldTPFNs[k]]);
		}
		let newTPs: number[] = [];
		for (let i = 0; i < oldFNTPInstances.length; i++) {
			if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
				newTPs.push(oldTPFNs[i]);
			}
		}
		// new FPs
		const oldTNFPs = classificationResult["TN"].concat(classificationResult["FP"]["all"]);
		let oldTNFPInstances = [];
		for (let k = 0; k < oldTNFPs.length; k++) {
			oldTNFPInstances.push(actInstances[oldTNFPs[k]]);
		}
		let newFPs: number[] = [];
		for (let i = 0; i < oldTNFPInstances.length; i++) {
			if (oldTNFPInstances[i].isSatisfied(newAxiomSet)) {
				newFPs.push(oldTNFPs[i]);
			}
		}

		const suggestion = new HowToAxiom("time_removal", axiom, axiomIdx, [th1, th2], "FN_MIN", newTPs, newFPs);
		return suggestion;
	}

	function getTimeExpansionSuggestion(
		axiom: AxiomData,
		axiomIdx: number,
		currentActivity: Activity,
		selectedFNs: number[],
		classificationResult: { [resType: string]: any },
		actInstances: ActivityInstance[]
	): HowToAxiom {
		const axType = axiom.getType();
		const th1 = axiom.getTh1();
		const th2 = axiom.getTh2();
		const event1 = axiom.getEvents()[0];
		const event2 = axiom.getEvents()[1];
		const FNs = classificationResult["FN"];

		let temporalDuration: { [idx: number]: number[] } = {};

		for (const idx of selectedFNs) {
			const instance = actInstances[idx];
			let eventInstances1: ActivityInstanceEvent[] = instance.getEvent(event1);
			let eventInstances2: ActivityInstanceEvent[] = [];
			if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
				eventInstances2 = instance.getEvent(event2);
			}

			if (axType === AxiomTypes.TYPE_DURATION && !eventInstances1.length) {
				// object interaction is missing
				continue;
			}
			if (axType === AxiomTypes.TYPE_TIME_DISTANCE && (!eventInstances1.length || !eventInstances2.length)) {
				// object interaction is missing
				continue;
			}
			if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
				// calculate all possible time distances
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

			if (!distFromTh1.length && !distFromTh2.length) {
				continue;
			}

			if (distFromTh1.length && Math.min(...distFromTh1) < Math.min(...distFromTh2)) {
				newTh1 = newTh1 - Math.min(...distFromTh1) - 1;
			} else if (distFromTh2.length && Math.min(...distFromTh1) >= Math.min(...distFromTh2)) {
				newTh2 = newTh2 + Math.min(...distFromTh2) + 1;
			}
		}

		// limit expansiom does not work
		if (th1 === newTh1 && th2 === newTh2) {
			return null;
		}

		const newAxiom = new AxiomData({ type: axiom.getType(), th1: newTh1, th2: newTh2, events: axiom.getEvents() });

		// new axiom has replaced the old one
		let newAxiomSet = [...currentActivity.getAxioms()];
		for (let j = 0; j < newAxiomSet.length; j++) {
			if (isEqual(newAxiomSet[j], axiom)) {
				newAxiomSet[j] = newAxiom;
			}
		}

		// new TPs
		const oldTPFNs = classificationResult["FN"].concat(classificationResult["TP"]);
		let oldFNTPInstances = [];
		for (let k = 0; k < oldTPFNs.length; k++) {
			oldFNTPInstances.push(actInstances[oldTPFNs[k]]);
		}
		let newTPs: number[] = [];
		for (let i = 0; i < oldFNTPInstances.length; i++) {
			if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
				newTPs.push(oldTPFNs[i]);
			}
		}

		// new FPs
		const oldTNFPs = classificationResult["TN"].concat(classificationResult["FP"]["all"]);
		let oldTNFPInstances = [];
		for (let k = 0; k < oldTNFPs.length; k++) {
			oldTNFPInstances.push(actInstances[oldTNFPs[k]]);
		}
		let newFPs: number[] = [];
		for (let i = 0; i < oldTNFPInstances.length; i++) {
			if (oldTNFPInstances[i].isSatisfied(newAxiomSet)) {
				newFPs.push(oldTNFPs[i]);
			}
		}

		const suggestion = new HowToAxiom(
			"time_expansion",
			axiom,
			axiomIdx,
			[newTh1, newTh2],
			"FN_MIN",
			newTPs,
			newFPs
		);

		return suggestion;
	}

	function getInteractionAxiomRemovalSuggestion(
		axiom: AxiomData,
		axiomIdx: number,
		currentActivity: Activity,
		selectedFNs: number[],
		classificationResult: { [resType: string]: any },
		actInstances: ActivityInstance[]
	): HowToAxiom {
		// remove the unsatisfied interaction event
		// remove all axioms that have the unsatisfied interaction event
		let oldAxiomSet = currentActivity.getAxioms();
		let newAxiomSet = [];
		for (let j = 0; j < oldAxiomSet.length; j++) {
			if (oldAxiomSet[j].getType() === AxiomTypes.TYPE_INTERACTION) {
				let newEvents = oldAxiomSet[j].getEvents().filter((ev) => ev !== axiom.getEvents()[0]);
				let newAxiom = new AxiomData({
					type: AxiomTypes.TYPE_INTERACTION,
					th1: -1,
					th2: -1,
					events: newEvents,
				});
				newAxiomSet.push(newAxiom);
			} else {
				if (!oldAxiomSet[j].getEvents().includes(axiom.getEvents()[0])) {
					newAxiomSet.push(oldAxiomSet[j]);
				}
			}
		}

		// new TPs
		const oldTPFNs = classificationResult["FN"].concat(classificationResult["TP"]);
		let oldFNTPInstances = [];
		for (let k = 0; k < oldTPFNs.length; k++) {
			oldFNTPInstances.push(actInstances[oldTPFNs[k]]);
		}
		let newTPs: number[] = [];
		for (let i = 0; i < oldFNTPInstances.length; i++) {
			if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
				newTPs.push(oldTPFNs[i]);
			}
		}
		// new FPs
		const oldTNs = classificationResult["TN"];
		let oldTNInstances = actInstances.filter((val, idx) => oldTNs.includes(idx));
		let newFPs: number[] = [];
		for (let i = 0; i < oldTNInstances.length; i++) {
			if (oldTNInstances[i].isSatisfied(newAxiomSet)) {
				newFPs.push(oldTNs[i]);
			}
		}

		const suggestion = new HowToAxiom("interaction_removal", axiom, axiomIdx, [-1, -1], "FN_MIN", newTPs, newFPs);
		return suggestion;
	}
}

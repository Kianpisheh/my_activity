import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import AxiomTypes from "../../model/AxiomTypes";
import AxiomData from "../../model/AxiomData";

import { getWhyHowToSuggestions } from "../HowToPanel/WhySuggestions";
import { getWhyNotHowToSuggestions } from "../HowToPanel/WhyNotSuggestions";
import HowToAxiom from "../../model/HowToAxiom";

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

export function handleWhyNotQuery(
	instances: ActivityInstance[],
	activity: Activity,
	selectedInstancesIdx: { [resType: string]: number[] },
	classificationResult: { [type: string]: any }
) {
	const unsatisfiedAxioms = getUnsatisfiedAxioms(instances, selectedInstancesIdx["FN"], activity);
	let i = 0;
	let suggestions: HowToAxiom[] = [];
	for (const [ax, selectedFNs] of Object.entries(unsatisfiedAxioms)) {
		const axiom = AxiomData.axiomFromString(ax);
		if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
			i += 1;
			continue;
		}
		suggestions = getWhyNotHowToSuggestions(axiom, i, activity, selectedFNs, classificationResult, instances);
		i += 1;
	}

	return suggestions;
}

export function handleWhyQuery(
	instances: ActivityInstance[],
	activity: Activity,
	selectedInstancesIdx: { [resType: string]: number[] },
	classificationResult: { [type: string]: any }
) {
	const axioms = activity.getAxioms();
	let suggestions: HowToAxiom[] = [];
	suggestions = getWhyHowToSuggestions(
		selectedInstancesIdx["FP"],
		axioms[1],
		1,
		activity,
		classificationResult,
		instances
	);

	return suggestions;
}

export default handleInstanceSelection;

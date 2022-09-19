import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import AxiomTypes from "../../model/AxiomTypes";

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
		const axioms = actInstance.findUnsatisfiedAxioms(activity);
		for (const ax of axioms) {
			if (allAxioms.hasOwnProperty(ax)) {
				allAxioms[ax].push(FNIdx);
			} else {
				allAxioms[ax] = [FNIdx];
			}
		}
	}

	// remove more constrained unsatisfied axioms
	let interactionAxIdx: number[] = [];
	for (const ax in allAxioms) {
		if (ax.split(":")[0] === AxiomTypes.TYPE_INTERACTION) {
			interactionAxIdx = interactionAxIdx.concat(allAxioms[ax]);
		}
	}

	for (const ax in allAxioms) {
		if (ax.split(":")[0] !== AxiomTypes.TYPE_INTERACTION) {
			allAxioms[ax] = allAxioms[ax].filter((val) => !interactionAxIdx.includes(val));
			if (allAxioms[ax].length === 0) {
				delete allAxioms[ax];
			}
		}
	}

	return allAxioms;
}

export default handleInstanceSelection;

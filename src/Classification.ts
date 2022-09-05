import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";
import AxiomData from "./model/AxiomData";

import cloneDeep from "lodash/cloneDeep";

export function classifyInstances(activityInstances: ActivityInstance[], activities: Activity[]) {
	let predActs: string[][] = [];
	let axNums: number[][] = [];
	for (const instance of activityInstances) {
		let classified = false;
		for (const act of activities) {
			if (instance.isSatisfied(act.getAxioms())) {
				if (!classified) {
					predActs.push([act.getName()]);
					axNums.push([act.getAxiomNum()]);
				} else {
					predActs[predActs.length - 1] = predActs[predActs.length - 1].concat([act.getName()]);
					axNums[axNums.length - 1] = axNums[axNums.length - 1].concat([act.getAxiomNum()]);
				}
				classified = true;
			}
		}
		if (!classified) {
			predActs.push(["Unknown"]);
			axNums.push([0]);
		}
	}

	return predActs;
}

export function updateClassificationResults(
	classificationResult: { [resType: string]: any },
	currentActivity: Activity,
	axiom: AxiomData,
	newAxiomSet: AxiomData[],
	actInstances: ActivityInstance[],
	activities: Activity[]
) {
	// new TPs
	const oldTPFNs = classificationResult?.[currentActivity.getName()]["FN"].concat(
		classificationResult?.[currentActivity.getName()]["TP"]
	);
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
	const oldTNFPs = classificationResult?.[currentActivity.getName()]["TN"].concat(
		classificationResult?.[currentActivity.getName()]["FP"]["all"]
	);
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

	// changes in other activities results
	let newCurrentActivity = cloneDeep(currentActivity);
	newCurrentActivity.updateAxioms(newAxiomSet);
	let newActivities = [];
	for (const act of activities) {
		if (act.getName() === newCurrentActivity.getName()) {
			newActivities.push(newCurrentActivity);
		} else {
			newActivities.push(act);
		}
	}

	const newPredictions = classifyInstances(actInstances, newActivities);
	const newClassificationResult = getClassificationResult(actInstances, newPredictions, newActivities);

	let newTPss: { [activity: string]: number[] } = {};
	let newFPss: { [activity: string]: number[] } = {};
	for (const act of Object.keys(newClassificationResult)) {
		newFPss[act] = newClassificationResult[act]["FP"]["all"];
		newTPss[act] = newClassificationResult[act]["TP"];
	}

	return { newTPs: newTPss, newFPs: newFPss };
}

export function getClassificationResult(
	activityInstances: ActivityInstance[],
	predictedActivities: string[][],
	activities: Activity[]
) {
	let results: { [act: string]: any } = {};
	for (const activity of activities) {
		if (!predictedActivities.length || !activity) {
			results[activity.getName()] = {};
		}

		let FP: number[] = [];
		let FN: number[] = [];
		let TP: number[] = [];
		let TN: number[] = [];
		let N: number = 0;

		let At = activity.getName();
		for (let i = 0; i < activityInstances.length; i++) {
			let Ai = activityInstances[i].getType();
			let Ap = predictedActivities[i];

			if (Ai === At) {
				N += 1;
				if (Ap.includes(At)) {
					TP.push(i);
				} else {
					FN.push(i);
				}
			} else {
				if (Ap.includes(At)) {
					FP.push(i);
				} else {
					TN.push(i);
				}
			}
		}

		let allFPs: { [idx: string]: number[] } = {}; // {drinking: [1, 4, 6]}
		allFPs["all"] = [...FP];
		for (let i = 0; i < FP.length; i++) {
			let idx: number = FP[i];
			if (activityInstances[idx].getType() in allFPs) {
				allFPs[activityInstances[idx].getType()].push(idx);
			} else {
				allFPs[activityInstances[idx].getType()] = [idx];
			}
		}

		results[activity.getName()] = { TP: TP, FN: FN, TN: TN, N: N, FP: allFPs };
	}

	return results;
}

import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";

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

	let finalPredictions: string[] = [];
	// assign the activity class with the most num of axioms
	for (let i = 0; i < predActs.length; i++) {
		const maxIdx = axNums[i].indexOf(Math.max(...axNums[i]));
		finalPredictions.push(predActs[i][maxIdx]);
	}

	return finalPredictions;
}

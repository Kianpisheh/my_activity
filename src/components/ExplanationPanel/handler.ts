
import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";

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
        new_selectedIdx[type] = new_selectedIdx[type].filter(value => value !== idx);
    } else {
        new_selectedIdx[type].push(idx);
    }

    return new_selectedIdx;
}

export function nonOntologicalWhyNot(activityInstances: ActivityInstance[], instancesIdx: number[], activity: Activity) {
    let allAxioms: { [type: string]: number[] } = {};
    let i = 0;
    for (const actInstance of activityInstances) {
        const axioms = actInstance.notSatisfied(activity);
        for (const ax of axioms) {
            if (allAxioms.hasOwnProperty(ax)) {
                allAxioms[ax].push(instancesIdx[i])
            } else {
                allAxioms[ax] = [instancesIdx[i]]
            }
        }
        i += 1;
    }

    return allAxioms;
}




export default handleInstanceSelection;
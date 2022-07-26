import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import ActivityInstanceEvent from "../../model/ActivityInstanceEvent";
import AxiomTypes from "../../model/AxiomTypes";
import AxiomData from "../../model/AxiomData";
import AxiomStat from "../../model/AxiomStats";


import {getWhyHowToSuggestions, getAxiomStats} from "../HowToPanel/WhySuggestions";
import {getWhyNotHowToSuggestions} from "../HowToPanel/WhyNotSuggestions";
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

// export function answerQuestion(
//     questionType: string,
//     instances: ActivityInstance[],
//     activity: Activity,
//     selectedInstancesIdx: { [resType: string]: number[] }
// ) {
//     if (questionType === "why_not") {
//         const unsAxioms = getUnsatisfiedAxioms(instances, selectedInstancesIdx["FN"], activity);
//         return { data: unsAxioms, dType: "unsatisfied_axioms" };
//     } else if (questionType === "why") {
//         const axioms = activity.getAxioms();
//         const FPs = selectedInstancesIdx["FP"];
//         const FPAxiomStats = getAxiomStats(instances.filter((val, i) => FPs.includes(i)), axioms);
//         return { data: FPAxiomStats, dType: "axiom_stats" };
//     }
// }

export function handleWhyNotQuery(
    instances: ActivityInstance[],
    activity: Activity,
    selectedInstancesIdx: { [resType: string]: number[] },
    classificationResult: { [type: string]: any }
) {
    const unsAxioms = getUnsatisfiedAxioms(instances, selectedInstancesIdx["FN"], activity);
    let i = 0;
    let suggestions: HowToAxiom[] = [];
    for (const [ax, selectedFNs] of Object.entries(unsAxioms)) {
        const axiom = AxiomData.axiomFromString(ax);
        if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
            i += 1;
            continue;
        }
        suggestions = getWhyNotHowToSuggestions(axiom, i, activity, selectedFNs, classificationResult, instances)
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
    for (let i = 1; i < axioms.length; i++) {
        suggestions = getWhyHowToSuggestions(selectedInstancesIdx["FP"], axioms[i], i, activity, classificationResult, instances);
    }

    return suggestions;
}

export default handleInstanceSelection;

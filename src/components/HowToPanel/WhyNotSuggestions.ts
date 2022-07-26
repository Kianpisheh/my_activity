import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import ActivityInstanceEvent from "../../model/ActivityInstanceEvent";
import AxiomData from "../../model/AxiomData";
import AxiomTypes from "../../model/AxiomTypes";
import HowToAxiom from "../../model/HowToAxiom";

import {classifyInstances} from "./WhySuggestions";
import isEqual from 'lodash.isequal';

export function getWhyNotHowToSuggestions(axiom: AxiomData, axiomIdx: number, currentActivity: Activity, selectedFNs: number[], classificationResult: { [resType: string]: any }, instances: ActivityInstance[]): HowToAxiom[] {
    let suggestions: HowToAxiom[] = [];
    const axType = axiom.getType();
    if (axType === AxiomTypes.TYPE_TIME_DISTANCE || axType === AxiomTypes.TYPE_DURATION) { 
        const suggestion1 = getTimeExpansionSuggestion(axiom, axiomIdx, currentActivity, selectedFNs, classificationResult, instances);
        if(suggestion1) {
            suggestions.push(suggestion1);
        }
        const suggestion2 = getTempAxiomRemovalSuggestion(axiom, axiomIdx, currentActivity, selectedFNs, classificationResult, instances);
        if(suggestion2) {
            suggestions.push(suggestion2);
        }
    }

    return suggestions;
}

// Assumption: only one axiom per axiom type
function getTempAxiomRemovalSuggestion(
    axiom: AxiomData,
    axiomIdx: number,
    currentActivity: Activity,
    selectedFNs: number[],
    classificationResult: { [resType: string]: any },
    actInstances: ActivityInstance[],
): HowToAxiom {
    const axType = axiom.getType();
    const th1 = axiom.getTh1();
    const th2 = axiom.getTh2();
    const event1 = axiom.getEvents()[0];
    const event2 = axiom.getEvents()[0];
    const FNs = classificationResult["FN"];
    const TNs = classificationResult["TN"];

    let outputIdx = [];
    for (const idx of selectedFNs) {
        const instance = actInstances[idx];

        if (axType === AxiomTypes.TYPE_DURATION) {
            if (instance.getEvent(event1).length > 0) {
                outputIdx.push(idx);
            }
        } else if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
            if (
                instance.getEvent(event1.toLowerCase()).length > 0 &&
                instance.getEvent(event2.toLowerCase()).length > 0
            ) {
                outputIdx.push(idx);
            }
        }
    }

    let newFPs: number[] = [];

    return new HowToAxiom("temporal_axiom_removal", axiom, axiomIdx, [], "FN_MIN", [], [])
    // classifyInstances(
    //     actInstances.filter((val, i) => TNs.includes(i)),
    //     axiomString
    // );
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
        let eventInstances1: ActivityInstanceEvent[] = instance.getEvent(event1.toLowerCase());
        let eventInstances2: ActivityInstanceEvent[] = [];
        if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
            eventInstances2 = instance.getEvent(event2.toLowerCase());
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

    const newAxiom = new AxiomData({"type": axiom.getType(), th1: newTh1, th2: newTh2, events: [event1, event2]})



    // new axiom has replaced the old one
    let newAxiomSet = [...currentActivity.getAxioms()];
    for (let j =0; j < newAxiomSet.length; j++) {
        if (isEqual(newAxiomSet[j], axiom)) {
            newAxiomSet[j] = newAxiom;
        }
    }

    // new TPs
    const oldTPFNs = classificationResult["FN"].concat(classificationResult["TP"]);
    let oldFNTPInstances = []
    for (let k = 0; k < oldTPFNs.length; k++) {
        oldFNTPInstances.push(actInstances[oldTPFNs[k]])
    }
    let newTPs: number[] = [];
    for (let i= 0; i < oldFNTPInstances.length; i++) {
        if (oldFNTPInstances[i].isSatisfied(newAxiomSet)) {
            newTPs.push(oldTPFNs[i]);
        }
    }
    // new FPs
    const oldTNs = classificationResult["TN"];
    let oldTNInstances = actInstances.filter((val, idx) => oldTNs.includes(idx));  
    let newFPs: number[] = [];
    for (let i= 0; i < oldTNInstances.length; i++) {
        if (oldTNInstances[i].isSatisfied(newAxiomSet)) {
            newFPs.push(oldTNs[i]);
        }
    }

    const suggestion = new HowToAxiom("time_expansion", axiom, axiomIdx, [newTh1, newTh2], "FN_MIN", newTPs, newFPs)

    return suggestion;
}
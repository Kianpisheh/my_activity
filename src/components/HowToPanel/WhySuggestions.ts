import Activity from "../../model/Activity";
import ActivityInstance from "../../model/ActivityInstance";
import ActivityInstanceEvent from "../../model/ActivityInstanceEvent";
import AxiomData from "../../model/AxiomData";
import AxiomStat from "../../model/AxiomStats";
import AxiomTypes from "../../model/AxiomTypes";
import HowToAxiom from "../../model/HowToAxiom";

import { subtractIntervals } from "../ExplanationPanel/utils.js";

export function getWhyHowToSuggestions(
    FPAxiomStat: { [axIdx: number]: AxiomStat },
    TPAxiomStat: { [axIdx: number]: AxiomStat },
    axiom: AxiomData,
    axIdx: number,
    currentActivity: Activity,
    classificationResult: { [resType: string]: any },
    instances: ActivityInstance[]
):HowToAxiom[] {
    let suggestions: HowToAxiom[] = [];
    // remove all FPs
    let newInterval = [];
    const axType = axiom.getType();

    let tfp1, ttp1;
    let tfp2, ttp2;

    for (let i = 1; i < 2; i++) {
        if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
            tfp1 = FPAxiomStat[i].minTimeDistance;
            tfp2 = FPAxiomStat[i].maxTimeDistance;
            if (TPAxiomStat) {
                ttp1 = TPAxiomStat[i].minTimeDistance;
                ttp2 = TPAxiomStat[i].maxTimeDistance;
            }
        } else if (axType === AxiomTypes.TYPE_DURATION) {
            tfp1 = FPAxiomStat[i].minDuration1;
            tfp2 = FPAxiomStat[i].maxDuration1;
            if (TPAxiomStat) {
                ttp1 = TPAxiomStat[i].minDuration1;
                ttp2 = TPAxiomStat[i].maxDuration1;
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
            for (let i= 0; i < oldTPInstances.length; i++) {
                if (oldTPInstances[i].isSatisfied(newAxiomSet)) {
                    newTPs.push(oldTPs[i]);
                }
            }
            suggestions.push(
                new HowToAxiom(
                    "time_contraction",
                    axiom,
                    Number(Object.keys(FPAxiomStat)[0]),
                    interval,
                    "FP0",
                    newTPs,
                    []
                )
            );
        });

        // FN_SAME suggestion
        let newFPInterval = subtractIntervals(tfp1, tfp2, ttp1, ttp2);
        if (newFPInterval.length === 0) {
            continue;
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
                for (let i= 0; i < oldFNInstances.length; i++) {
                    if (oldFNInstances[i].isSatisfied(newAxiomSet)) {
                        newTPs.push(oldFNs[i]);
                    }
                }
                // new FPs
                const oldTNs = classificationResult["TN"];
                let oldTNInstances = instances.filter((val, idx) => oldTNs.includes(idx));  
                let newFPs: number[] = [];
                for (let i= 0; i < oldTNInstances.length; i++) {
                    if (oldTNInstances[i].isSatisfied(newAxiomSet)) {
                        newFPs.push(oldTNs[i]);
                    }
                }
                suggestions.push(
                    new HowToAxiom(
                        "time_contraction",
                        axiom,
                        Number(Object.keys(FPAxiomStat)[0]),
                        interval,
                        "FN_SAME",
                        newTPs,
                        newFPs
                    )
                );
            });
        }
    }
    return suggestions;
}

export function classifyInstances(instances: ActivityInstance[], axiomString: string) {
    if (axiomString === "") {
        return [];
    }

    let outputIdx: number[] = [];
    const { axType, event1, event2, th1, th2 } = AxiomData.destrcutAxiomFromString(axiomString);

    // single event interaction axiom
    if (axType === AxiomTypes.TYPE_INTERACTION) {
        instances.forEach((instance, idx) => {
            if (instance.hasEvent(event1)) {
                outputIdx.push(idx);
            }
        });
    }

    // time-distance axiom
    if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
        instances.forEach((instance, idx) => {
            if (instance.hasEvent(event1) && instance.hasEvent(event2)) {
                let evInstance1 = instance.getEvent(event1.toLowerCase());
                let evInstance2 = instance.getEvent(event2.toLowerCase());
                loop1: for (let i = 0; i < evInstance1.length; i++) {
                    for (let j = 0; j < evInstance2.length; j++) {
                        const timeDsitance = evInstance2[j].getStartTime() - evInstance2[i].getEndTime();
                        if (timeDsitance < th2 && timeDsitance > th1) {
                            outputIdx.push(idx);
                            break loop1;
                        }
                    }
                }
            }
        });
    }

    // duration axiom
    if (axType === AxiomTypes.TYPE_DURATION) {
        instances.forEach((instance, idx) => {
            if (instance.hasEvent(event1) && instance.hasEvent(event2)) {
                let eventInstances: ActivityInstanceEvent[] = instance.getEvent(event1);
                for (const evInstance of eventInstances) {
                    const evDuration = evInstance.getDuration();
                    if (evDuration < th2 && evDuration > th1) {
                        outputIdx.push(idx);
                    }
                }
            }
        });
    }

    return outputIdx;
}
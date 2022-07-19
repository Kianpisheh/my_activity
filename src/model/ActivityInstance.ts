import ActivityInstanceEvent, { IEvent } from "./ActivityInstanceEvent"
import Activity from "./Activity";
import Constraint from "./Constraint";

export interface IActivityInstance {
    name: string;
    type: string;
    events: IEvent[];
}

class ActivityInstance {

    name: string;
    type: string;
    events: ActivityInstanceEvent[];

    constructor(instanceObj: IActivityInstance) {
        this.name = instanceObj["name"];
        this.type = instanceObj["type"];
        this.events = [];
        instanceObj["events"].forEach(ev => {
            this.events.push(new ActivityInstanceEvent(ev));
        });
    }

    getType() {
        return this.type;
    }

    setType(type: string) {
        this.type = type;
    }

    getEvents() {
        return this.events;
    }

    setEvents(events: ActivityInstanceEvent[]) {
        this.events = events;
    }

    getTimes() {
        let timestamps: object[] = []
        this.events.map(ev => {
            return timestamps.push(ev.getTime());
        });

        return timestamps;
    }

    getEventList(): string[] {
        return this.events.map(ev => {
            return ev.getType();
        })
    }

    getEventIndividuals(): string[] {
        return this.events.map(ev => {
            return ev.getName();
        })
    }

    getMaxTime(): number {
        let maxTime = this.events?.[0]?.["endTime"] ?? 0;
        this.events.forEach(ev => {
            if (ev["endTime"] > maxTime) {
                maxTime = ev["endTime"];
            }
        });
        return maxTime ??= 0
    }

    getName(): string {
        return this.name;
    }

    notSatisfied(activity: Activity) {
        let actInstanceEvents = this.getEventList();
        let notSatisfiedInteractionAxs: string[] = [];
        let notSatisfiedTemporalAxs = [];

        // first check interaction axioms
        for (const ev of activity.getEvents()) {
            if (!actInstanceEvents.includes(ev.toLocaleLowerCase())) {
                notSatisfiedInteractionAxs.push("interaction:" + ev);
            }
        }

        // now check temporal axioms
        let constraints = activity.getConstraints();
        for (const constraint of constraints) {
            // not satisfied constraint events 
            let notSatevents = constraint.events.filter(ev => notSatisfiedInteractionAxs.includes(ev.toLowerCase()));
            if (notSatevents.length || !this.isConstraintSatisfied(constraint)) {
                if (constraint.type === "time_distance") {
                    notSatisfiedTemporalAxs.push("time_distance:" + constraint.events[0] + ":" + constraint.events[1]);
                } else if (constraint.type === "duration") {
                    notSatisfiedTemporalAxs.push("duration:" + constraint.events[0]);
                }
                continue;
            }
        }

        return notSatisfiedInteractionAxs.concat(notSatisfiedTemporalAxs);
    }




    isConstraintSatisfied(constraint: Constraint): boolean {
        const constraintType = constraint.type;
        const th1 = constraint.th1;
        const th2 = constraint.th2;

        if (constraintType === "duration") {
            let eventInstances: ActivityInstanceEvent[] = this.getEvent(constraint.events[0]);
            for (const evInstance of eventInstances) {
                const evDuration = evInstance.getDuration();
                if (evDuration < th2 && evDuration > th1) {
                    return true;
                }
            }
        } else if (constraintType === "time_distance") {
            let eventInstances1: ActivityInstanceEvent[] = this.getEvent(constraint.events[0].toLowerCase());
            let eventInstances2: ActivityInstanceEvent[] = this.getEvent(constraint.events[1].toLowerCase());
            for (let i = 0; i < eventInstances1.length; i++) {
                for (let j = 0; j < eventInstances2.length; j++) {
                    const timeDsitance = eventInstances2[j].getStartTime() - eventInstances1[i].getEndTime();
                    if (timeDsitance < th2 && timeDsitance > th1) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    getEvent(evq: string): ActivityInstanceEvent[] {
        let eventList: ActivityInstanceEvent[] = [];
        for (const event of this.events) {
            if (event.getType() === evq) {
                eventList.push(event);
            }
        }
        return eventList;
    }
}


export default ActivityInstance;
import ActivityInstanceEvent, { IEvent } from "./ActivityInstanceEvent"


interface IActivityInstance {
    name: string;
    events: IEvent[];
}

class ActivityInstance {

    name: string;
    events: ActivityInstanceEvent[];

    constructor(instanceObj: IActivityInstance) {
        this.name = instanceObj["name"];
        this.events = []
        instanceObj["events"].forEach(ev => {
            this.events.push(new ActivityInstanceEvent(ev));
        });
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
            return ev.getName();
        })
    }

    getMaxTime(): number {
        let maxTime = this.events[0]["endTime"];
        this.events.forEach(ev => {
            if (ev["endTime"] > maxTime) {
                maxTime = ev["endTime"];
            }
        });
        return maxTime
    }

    getName(): string {
        return this.name;
    }
}

export default ActivityInstance;
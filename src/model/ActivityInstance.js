import ActivityInstanceEvent from "./ActivityInstanceEvent";

class ActivityInstance {
    constructor(instanceObj) {
        this.name = instanceObj["name"];
        this.events = []
        console.log(instanceObj)
        instanceObj["events"].forEach(ev => {
            this.events.push(new ActivityInstanceEvent(ev));
        });
    }

    getTimes() {
        let timestamps = []
        this.events.map(ev => {
            return timestamps.push(ev.getTime());
        });

        return timestamps;
    }

    getEventList() {
        return this.events.map(ev => {
            return ev.getName();
        })
    }

    getMaxTime() {
        let maxTime = this.events[0]["endTime"];
        this.events.forEach(ev => {
            if (ev["endTime"] > maxTime) {
                maxTime = ev["endTime"];
            }
        });
        return maxTime
    }

    getName() {
        return this.name;
    }
}

export default ActivityInstance;
class ActivityInstance {
    constructor(instanceObj) {
        this.name = instanceObj["name"];
        this.events = instanceObj["events"];
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
        if (this.events) {
            let lastEvent = this.events[this.events.length - 1];
            if (lastEvent) {
                return lastEvent.getTime()["t2"];
            }
        }

        return 0;
    }
}

export default ActivityInstance;
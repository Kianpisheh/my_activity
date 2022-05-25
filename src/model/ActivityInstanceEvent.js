class ActivityInstanceEvent {

    constructor(eventObject) {
        this.name = eventObject["name"];
        this.startTime = eventObject["start_time"];
        this.endTime = eventObject["end_time"];
    }

    getTime() {
        return { t1: this.startTime, t2: this.endTime }
    }

    getName() {
        return this.name;
    }

}

export default ActivityInstanceEvent;
class ActivityInstanceEvent {

    constructor(eventObject) {
        this.name = eventObject["name"];
        this.type = eventObject["type"];
        this.startTime = eventObject["startTime"];
        if (eventObject["startTime"] <= 0) { //TODO:
            this.startTime = 10;
        }
        this.endTime = eventObject["endTime"];
        if (eventObject["endTime"] <= 0) {
            this.endTime = 15;
        }
    }

    getTime() {
        return { "startTime": this.startTime, "endTime": this.endTime }
    }

    getName() {
        return this.type;
    }

}

export default ActivityInstanceEvent;
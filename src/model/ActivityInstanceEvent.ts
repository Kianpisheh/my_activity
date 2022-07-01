
export interface IEvent {
    name: string;
    type: string;
    startTime: number;
    endTime: number;
    location: string;
}
class ActivityInstanceEvent {

    name: string;
    type: string;
    startTime: number;
    endTime: number;
    location: string;

    constructor(eventObject: IEvent) {
        this.name = eventObject["name"];
        this.type = eventObject["type"];
        this.startTime = eventObject["startTime"];
        this.endTime = eventObject["endTime"];
        this.location = eventObject["location"];
    }

    getTime() {
        return { "startTime": this.startTime, "endTime": this.endTime }
    }

    getType(): string {
        return this.type;
    }

    getName(): string {
        return this.name;
    }

    getLocation(): string {
        return this.location;
    }

}

export default ActivityInstanceEvent;
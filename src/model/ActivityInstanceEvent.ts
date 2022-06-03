
export interface IEvent {
    name: string;
    type: string;
    startTime: number;
    endTime: number;
}
class ActivityInstanceEvent {

    name: string;
    type: string;
    startTime: number;
    endTime: number;
    
    constructor(eventObject: IEvent) {
        this.name = eventObject["name"];
        this.type = eventObject["type"];
        this.startTime = eventObject["startTime"];
        this.endTime = eventObject["endTime"];
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

}

export default ActivityInstanceEvent;
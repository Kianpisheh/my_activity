
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

    getName(): string {
        return this.type;
    }

}

export default ActivityInstanceEvent;
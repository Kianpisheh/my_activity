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
	eventMap: { [key: string]: string } = {
		coffee_cup: "cup",
		dish: "plate",
		water_bottle: "bottle",
		cupboard: "cabinet",
		salad_bowl: "bowl",
	};

	constructor(eventObject: IEvent) {
		this.name = eventObject["name"];
		this.type = eventObject["type"];
		if (this.eventMap[eventObject["type"]]) {
			this.type = this.eventMap[eventObject["type"]];
		}
		this.startTime = eventObject["startTime"];
		this.endTime = eventObject["endTime"];
		this.location = eventObject["location"];
	}

	getTime() {
		return { startTime: this.startTime, endTime: this.endTime };
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

	getDuration(): number {
		return this.endTime - this.startTime;
	}

	getStartTime(): number {
		return this.startTime;
	}

	getEndTime(): number {
		return this.endTime;
	}
}

export default ActivityInstanceEvent;

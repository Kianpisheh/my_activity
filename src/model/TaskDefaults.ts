import Activity from "./Activity";

class TaskDefaults {
	static getDefault(task: string): Activity {
		let activity = null;
		if (task === "Task1") {
			activity = new Activity({
				name: "MakingCoffee",
				id: 0,
				events: ["Carafe", "CoffeeMaker"],
				excludedEvents: [],
				eventORList: [],
				constraints: [],
			});
		} else if (task === "Task2") {
			activity = new Activity({
				name: "SandwichTime",
				id: 0,
				events: ["Bread", "Salami", "Fridge", "Cheese"],
				excludedEvents: [],
				eventORList: [],
				constraints: [],
			});
		} else if (task === "Task3") {
			activity = new Activity({
				name: "MakingCoffee",
				id: 0,
				events: ["Cabinet", "Coffee"],
				excludedEvents: [],
				eventORList: [],
				constraints: [],
			});
		} else if (task === "Task4") {
			activity = new Activity({
				name: "Cooking",
				id: 0,
				events: ["Stove"],
				excludedEvents: [],
				eventORList: [],
				constraints: [],
			});
		}

		return activity;
	}
}

export default TaskDefaults;

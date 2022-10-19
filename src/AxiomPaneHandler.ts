import AxiomTypes from "./model/AxiomTypes";
import AxiomManager from "./model/AxiomManager";
import Activity from "./model/Activity";
import AxiomData from "./model/AxiomData";

import { logEvent } from "./APICalls/activityAPICalls";
import TaskDefaults from "./model/TaskDefaults";

function handleAxiomPaneMessages(
	message: string,
	values: { [key: string]: any },
	activities: Activity[],
	currentActivtyIdx: number,
	currentActivity: Activity,
	datasetUser: string
) {
	let newActivities = [...activities];

	if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
		let newAxioms = AxiomManager.createAxiom(currentActivity.getAxioms(), values);
		newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);
		logEvent(values["type"], "axiom_type", "new_axiom_type");
		logEvent({ activity: newActivities?.[currentActivtyIdx], axiom: values }, "activity", "new_axiom", datasetUser);
		// logEvent({ activity: newActivities?.[currentActivtyIdx], axiom: values }, "activity", "new_axiom", datasetUser);
		logEvent(newActivities, "activities", "activities", datasetUser);
	} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED) {
		let newAxioms = AxiomManager.updateTimeConstraint(
			values["id"],
			currentActivity.getAxioms(),
			values["time"],
			values["type"]
		);
		newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);
	} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_STATUS_UPDATED) {
		let newAxioms = AxiomManager.updateTimeConstraintStatus(
			values["id"],
			currentActivity.getAxioms(),
			values["active"],
			values["type"]
		);
		let newActivities = [...activities];
		newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);
		logEvent(newActivities?.[currentActivtyIdx], "activity", "time_limit_status_update", datasetUser);
		logEvent(newActivities, "activities", "activities", datasetUser);
	} else if (message === AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION) {
		let newAxioms = AxiomManager.removeObjectInteraction(
			values["axiomIdx"],
			values["eventType"],
			currentActivity.getAxioms()
		);
		let newActivities = [...activities];
		newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);
		logEvent(newActivities?.[currentActivtyIdx], "activity", "remove_interaction_axiom", datasetUser);
		logEvent(newActivities, "activities", "activities", datasetUser);
	} else if (message === AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION_EXCLUSION) {
		let newAxioms = AxiomManager.removeObjectInteractionExclusion(
			values["axiomIdx"],
			values["eventType"],
			currentActivity.getAxioms()
		);
		let newActivities = [...activities];
		newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);
		logEvent(newActivities?.[currentActivtyIdx], "activity", "remove_interaction_exclusion_axiom", datasetUser);
		logEvent(newActivities, "activities", "activities", datasetUser);
	} else if (message === AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING) {
		newActivities[currentActivtyIdx]?.setName(values["title"]);
	} else if (message === AxiomTypes.MSG_ACTIVITY_TITLE_UPDATED) {
		newActivities[currentActivtyIdx]?.setName(values["title"]);
	} else if (message === AxiomTypes.MSG_REMOVE_AXIOM) {
		let axioms: AxiomData[] | undefined = newActivities?.[currentActivtyIdx]?.getAxioms();
		axioms?.splice(values["idx"], 1);
		if (axioms) {
			newActivities?.[currentActivtyIdx]?.updateAxioms(axioms);
			logEvent(newActivities?.[currentActivtyIdx], "activity", "remove_axiom", datasetUser);
			logEvent(newActivities, "activities", "activities", datasetUser);
		} else {
			return null;
		}
	} else if (message === AxiomTypes.MSG_TIME_DISTANCE_AXIOM_FLIP_EVENTS) {
		let axioms = currentActivity.getAxioms();
		axioms[values["idx"]].flipEvents();
		newActivities?.[currentActivtyIdx]?.updateAxioms(axioms);
	} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_FINALIZED) {
		logEvent(newActivities?.[currentActivtyIdx], "activity", "time_limit_update", datasetUser);
		logEvent(newActivities, "activities", "activities", datasetUser);
	} else if (message === AxiomTypes.MSG_RESET_ACTIVITY) {
		const defaultActivities = TaskDefaults.getDefault(datasetUser.split("-")[0]);
		if (defaultActivities) {
			newActivities = [TaskDefaults.getDefault(datasetUser.split("-")[0])];
		}
	} else if (message === AxiomTypes.MSG_OR_EVENTS_AXIOM_EDIT) {
		// find the corresponding axiom
		let newAxioms = newActivities?.[currentActivtyIdx]?.getAxioms();
		for (let i = 0; i < newAxioms.length; i++) {
			if (newAxioms[i].getType() === AxiomTypes.TYPE_OR_INTERACTION) {
				if (Activity.subSetEither(values["events"], newAxioms[i].getEvents())) {
					newAxioms[i].setEvents(values["events"]);
					break;
				}
			}
		}
		newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);
	}

	return newActivities;
}

export { handleAxiomPaneMessages };

import AxiomTypes from "./model/AxiomTypes";
import AxiomManager from "./model/AxiomManager";
import Activity from "./model/Activity";
import AxiomData from "./model/AxiomData";

import { logEvent } from "./APICalls/activityAPICalls";

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
		logEvent(newActivities?.[currentActivtyIdx], "activity", "new_axiom", datasetUser);
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
	}

	return newActivities;
}

export { handleAxiomPaneMessages };

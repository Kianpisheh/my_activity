import AxiomTypes from "./model/AxiomTypes";
import AxiomManager from "./model/AxiomManager";
import Activity from "./model/Activity";
import AxiomData from "./model/AxiomData";

function handleAxiomPaneMessages(message: string, values: { [key: string]: any }, activities: Activity[], currentActivtyIdx: number, currentActivity: Activity) {
    let newActivities = [...activities];

    if (message === AxiomTypes.MSG_CREATE_NEW_AXIOM) {
        let newAxioms = AxiomManager.createAxiom(
            currentActivity.getAxioms(),
            values
        );
        newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);

    } else if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
        let newAxioms = AxiomManager.createAxiom(
            currentActivity.getAxioms(),
            values
        );
        newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);

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
            values["type"],
        );
        let newActivities = [...activities];
        newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);

    } else if (message === AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION) {
        let newAxioms = AxiomManager.removeObjectInteraction(values["axiomIdx"], values["eventType"], currentActivity.getAxioms());
        let newActivities = [...activities];
        newActivities?.[currentActivtyIdx]?.updateAxioms(newAxioms);

    } else if (message === AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING) {
        newActivities[currentActivtyIdx]?.setName(values["title"]);
    } else if (message === AxiomTypes.MSG_REMOVE_AXIOM) {
        let axioms: AxiomData[] | undefined = newActivities?.[currentActivtyIdx]?.getAxioms();
        axioms?.splice(values["idx"], 1);
        if (axioms) {
            newActivities?.[currentActivtyIdx]?.updateAxioms(axioms);
        } else {
            return null;
        }

    } else if (message === AxiomTypes.MSG_INTERACTION_OR_AXIOM_CREATION) {
        let currActivity = currentActivity;
        currActivity.addEventOR(Array.from(values.selectedEvents));
        newActivities[currentActivtyIdx] = currActivity;

    } else if (message === AxiomTypes.MSG_TIME_DISTANCE_AXIOM_FLIP_EVENTS) {
        let axioms = currentActivity.getAxioms();
        axioms[values["idx"]].flipEvents();
        newActivities?.[currentActivtyIdx]?.updateAxioms(axioms);
    }

    return newActivities;
}


export { handleAxiomPaneMessages };
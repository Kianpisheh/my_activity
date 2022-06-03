import AxiomTypes from "./model/AxiomTypes";
import AxiomManager from "./model/AxiomManager";
import Activity from "./model/Activity";
import AxiomData from "./model/AxiomData";

function handleAxiomPaneMessages(message: string, values: { [key: string]: any }, activities: Activity[], currentActivtyIdx: number, currentActivity: Activity) {
    let newActivities = [...activities];

    if (message === AxiomTypes.MSG_CREATE_NEW_AXIOM) {
        let new_axioms = AxiomManager.createAxiom(
            currentActivity.getAxioms(),
            values
        );
        newActivities[currentActivtyIdx].updateAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
        let new_axioms = AxiomManager.createAxiom(
            currentActivity.getAxioms(),
            values
        );
        newActivities[currentActivtyIdx].updateAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED) {
        let new_axioms = AxiomManager.updateTimeConstraint(
            values.id,
            currentActivity.getAxioms(),
            values.time,
            values.type
        );
        newActivities[currentActivtyIdx].updateAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_STATUS_UPDATED) {
        let new_axioms = AxiomManager.updateTimeConstraintStatus(
            values.id,
            currentActivity.getAxioms(),
            values.active,
            values.type,
        );
        let newActivities = [...activities];
        newActivities[currentActivtyIdx].updateAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_ACTIVITY_TITLE_UPDATED) {
        newActivities[currentActivtyIdx]["name"] = values["title"];
    } else if (message === AxiomTypes.MSG_REMOVE_AXIOM) {
        let axioms: AxiomData[] = newActivities[currentActivtyIdx].getAxioms();
        axioms.splice(values.idx, 1);
        newActivities[currentActivtyIdx].updateAxioms(axioms);
    }

    return newActivities;
}


export { handleAxiomPaneMessages };
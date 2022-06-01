import AxiomTypes from "./model/AxiomTypes";
import AxiomManager from "./model/AxiomManager";

function handleAxiomPaneMessages(message, values, activities, currentActivtyIdx, currentActivity) {
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
            values.time
        );
        let newActivities = [...activities];
        newActivities[currentActivtyIdx].updateAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_ACTIVITY_TITLE_UPDATED) {
        newActivities[currentActivtyIdx]["name"] = values["title"];
    }

    return newActivities;
}


export { handleAxiomPaneMessages };
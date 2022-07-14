import axios from "axios";

export async function retrieveActivities(url) {
    return axios.get(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
    });
}

export async function retrieveInstances() {
    const url = "http://localhost:8082/instance/instances";
    return axios.get(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
    });
}

export async function explain(activityInstance, targetActivity, queryType) {
    const url = "http://localhost:8082/explainer/explain";
    return axios.post(url, { "instance": activityInstance, "activity": targetActivity, "type": queryType })
}

export async function updateDatabase(activity, task) {
    const url = "http://localhost:8082/activity/" + task;
    return axios.post(url, activity);
}

export async function classifyInstance(activityInstance) {
    const url = "http://localhost:8082/instance/classify";
    return axios.post(url, activityInstance);
}

export async function getRuleitems() {
    const url = "http://localhost:8082/ruleitems/get_ruleitems";
    return axios.get(url);
}

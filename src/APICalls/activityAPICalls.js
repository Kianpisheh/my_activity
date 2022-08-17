import axios from "axios";

export async function checkPassword(user, pass) {
	const url = "http://localhost:8080/pass";
	return axios.post(url, { user: user, pass: pass });
}

export async function retrieveActivities(dataset) {
	const url = "http://localhost:8080/activity";
	return axios.post(url, { dataset: dataset });
}

export async function retrieveInstances(dataset) {
	const url = "http://localhost:8080/instance/instances";
	return axios.post(url, { dataset: dataset });
}

export async function explain(activityInstance, targetActivity, queryType) {
	const url = "http://localhost:8080/explainer/explain";
	return axios.post(url, { instance: activityInstance, activity: targetActivity, type: queryType });
}

export async function updateDatabase(activity, task, dataset) {
	const url = "http://localhost:8080/activity/" + task;
	return axios.post(url, { activity: activity, dataset: dataset });
}

export async function classifyInstance(activityInstance) {
	const url = "http://localhost:8080/instance/classify";
	return axios.post(url, activityInstance);
}

export async function getRuleitems() {
	const url = "http://localhost:8080/ruleitems/get_ruleitems";
	return axios.get(url);
}

import axios from "axios";

export async function checkPassword(user, pass) {
	const url = "http://localhost:8080/pass";
	return axios.post(url, { user: user, pass: pass });
}

export async function restartServer(dataset, user) {
	const url = "http://localhost:8080/restart";
	return axios.post(url, {});
}

export async function retrieveActivities(dataset, user) {
	const url = "http://localhost:8080/activity";
	return axios.post(url, { dataset: dataset, user: user });
}

export async function retrieveInstances(dataset) {
	const url = "http://localhost:8080/instance/instances";
	return axios.post(url, { dataset: dataset });
}

export async function explain(activityInstance, targetActivity, queryType) {
	const url = "http://localhost:8080/explainer/explain";
	return axios.post(url, { instance: activityInstance, activity: targetActivity, type: queryType });
}

export async function updateDatabase(activity, task, dataset, user) {
	const url = "http://localhost:8080/activity/" + task;
	return axios.post(url, { activity: activity, dataset: dataset, user: user });
}

export async function classifyInstance(activityInstance) {
	const url = "http://localhost:8080/instance/classify";
	return axios.post(url, activityInstance);
}

export async function getRuleitems(dataset) {
	const url = "http://localhost:8080/ruleitems/get_ruleitems";
	return axios.post(url, { dataset: dataset });
}

export async function logEvent(data, dataLabel, msg, dataset) {
	const url = "http://localhost:8080/log_event";
	let jj = JSON.parse(JSON.stringify(data));
	let data2 = { msg: msg, timestamp: Math.floor(Date.now() / 1000) };
	data2[dataLabel] = jj;
	return axios.post(
		url,
		{ event: JSON.stringify(data2), dataset: dataset },
		{
			headers: {
				// Overwrite Axios's automatically set Content-Type
				"Content-Type": "application/json",
			},
		}
	);
}

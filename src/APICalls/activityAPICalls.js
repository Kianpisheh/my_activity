import axios from "axios";

export async function checkPassword(user, pass) {
	const url = "https://obscure-badlands-47642.herokuapp.com/pass";
	return axios.post(url, { user: user, pass: pass });
}

export async function retrieveActivities(dataset) {
	const url = "https://obscure-badlands-47642.herokuapp.com/activity";
	return axios.post(url, { dataset: dataset });
}

export async function retrieveInstances(dataset) {
	const url = "https://obscure-badlands-47642.herokuapp.com/instance/instances";
	return axios.post(url, { dataset: dataset });
}

export async function explain(activityInstance, targetActivity, queryType) {
	const url = "https://obscure-badlands-47642.herokuapp.com/explainer/explain";
	return axios.post(url, { instance: activityInstance, activity: targetActivity, type: queryType });
}

export async function updateDatabase(activity, task, dataset) {
	const url = "https://obscure-badlands-47642.herokuapp.com/activity/" + task;
	return axios.post(url, { activity: activity, dataset: dataset });
}

export async function classifyInstance(activityInstance) {
	const url = "https://obscure-badlands-47642.herokuapp.com/instance/classify";
	return axios.post(url, activityInstance);
}

export async function getRuleitems() {
	const url = "https://obscure-badlands-47642.herokuapp.com/ruleitems/get_ruleitems";
	return axios.get(url);
}

import axios from "axios";
import ActivityInstance from "../model/ActivityInstance";

export async function retrieveActivities(url) {
  return axios.get(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}

export async function retrieveInstances(url) {
  return axios.get(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}

export async function explain(url, activityInstance, targetActivity, queryType) {
  return axios.post(url, { "instance": activityInstance, "activity": targetActivity, "type": queryType })
}

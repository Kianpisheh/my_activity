import axios from "axios";

export async function retrieveActivities(url) {
  return axios.get(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}

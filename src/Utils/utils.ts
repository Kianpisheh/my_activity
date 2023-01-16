import IEvent from "../model/ActivityInstanceEvent";

interface ITime {
	startTime: number;
	endTime: number;
}

interface IInterval {
	x1: number;
	x2: number;
}

export function mergeConsecEvents(timestamps: ITime[], events: IEvent[], mergeTh: number) {
	let newTimestamps: ITime[] = [];
	let newEvents: IEvent[] = [];
	let idxMap: { [key: number]: number } = {};

	if (!timestamps || !events || timestamps.length === 0) {
		return null;
	}

	let newStartTime: number = timestamps?.[0]?.startTime;
	let lastIdx = 0;
	for (let i = 1; i < timestamps.length; i++) {
		let currentTime: number = timestamps[i]?.startTime;
		let prevTime: number = timestamps[i - 1]?.endTime;

		if (currentTime - prevTime > mergeTh || events[i].getType() !== events[i - 1].getType()) {
			newTimestamps.push({ startTime: newStartTime, endTime: timestamps[i - 1]?.endTime });
			newStartTime = timestamps[i]?.startTime;
			newEvents.push(events[i - 1]);
			idxMap[i - 1] = newEvents.length - 1;
			for (let k = lastIdx + 1; k < i - 1; k++) {
				idxMap[k] = newEvents.length - 2;
			}
			lastIdx = i;

			if (i === timestamps.length - 1) {
				newTimestamps.push({ startTime: timestamps[i]?.startTime, endTime: timestamps[i]?.endTime });
				newEvents.push(events[i]);
				idxMap[i] = newEvents.length - 1;
				for (let k = lastIdx + 1; k < i; k++) {
					idxMap[k] = newEvents.length - 2;
				}
				lastIdx = i;
			}
		} else if (i === timestamps.length - 1) {
			newTimestamps.push({ startTime: newStartTime, endTime: timestamps[i]?.endTime });
			newEvents.push(events[i]);
			idxMap[i] = newEvents.length - 1;
			for (let k = lastIdx + 1; k < i; k++) {
				idxMap[k] = newEvents.length - 2;
			}
			lastIdx = i;
		}
	}

	return { times: newTimestamps, events: newEvents, idxMap: idxMap };
}

export function mergeCloseEvents(timestamps: ITime[], events: IEvent[], mergeTh: number) {
	let times = [...timestamps];
	let newTimestamps: ITime[] = [];
	let newEvents: IEvent[] = [];

	let lastCluster: number[] = [];
	let allClusters: number[] = [];
	let idxMap: { [key: number]: number } = {};

	for (let i = 0; i < times.length; i++) {
		if (allClusters.includes(i)) {
			continue; // skip ones that are examined already
		}
		lastCluster = [i];
		allClusters.push(i);

		for (let j = i; j < times.length - 1; j++) {
			// find the next cluster
			let lastIdx = lastCluster[lastCluster.length - 1] ?? 0;
			let dt = (times[j + 1]?.startTime ?? 0) - (times[lastIdx ?? 0]?.endTime ?? 0);
			if (dt > mergeTh) {
				// collect the last result
				let t1: number = times[lastCluster[0] ?? 0]?.startTime ?? 0;
				let t2: number = times[lastCluster[lastCluster.length - 1] ?? 0]?.endTime ?? 0;
				newTimestamps.push({ startTime: t1, endTime: t2 });
				newEvents.push(events[lastIdx]);
				for (let k = 0; k < lastCluster.length; k++) {
					idxMap[lastCluster[k]] = newEvents.length - 1;
				}
				if (j === times.length - 2) {
					newTimestamps.push({ startTime: times[j + 1].startTime, endTime: times[j + 1].endTime });
					newEvents.push(events[j + 1]);
					idxMap[j + 1] = newEvents.length - 1;
					for (let k = 0; k < lastCluster.length; k++) {
						idxMap[lastCluster[k]] = newEvents.length - 1;
					}
				}
				break;
			} else {
				// next event is close enough
				if (events[j + 1].getType() === events[lastIdx].getType()) {
					// same event
					lastCluster.push(j + 1);
					allClusters.push(j + 1);
					if (j === times.length - 2) {
						newTimestamps.push({ startTime: times[j + 1].startTime, endTime: times[j + 1].endTime });
						newEvents.push(events[j + 1]);
						for (let k = 0; k < lastCluster.length; k++) {
							idxMap[lastCluster[k]] = newEvents.length - 1;
						}
					}
				}
			}
		}
	}

	return { times: newTimestamps, events: newEvents, idxMap: idxMap };
}

export function nonLinearScale(timestamps: ITime[]): ITime[] | null {
	if (!timestamps) {
		return null;
	}

	let newTimestamps: ITime[] = [];

	let duration: number = 0;
	let timeDistance: number = 0;
	newTimestamps.push({
		startTime: 0,
		endTime: _nonlinearScale(timestamps[0]?.endTime - timestamps[0]?.startTime),
	} as ITime);
	for (let i = 1; i < timestamps.length; i++) {
		timeDistance = (timestamps[i]?.startTime ?? 0) - (timestamps[i - 1]?.endTime ?? 0); // old time distance
		timeDistance = timeDistance > 0 ? timeDistance : 0;
		let newStartTime = (newTimestamps[i - 1]?.endTime ?? 0) + _nonlinearScale(timeDistance); // new startTime
		duration = (timestamps[i]?.endTime ?? 0) - (timestamps[i]?.startTime ?? 0); // old duration
		duration = duration > 0 ? duration : 0;
		newTimestamps.push({ startTime: newStartTime, endTime: newStartTime + _nonlinearScale(duration) });
	}

	return newTimestamps;
}

export function inverseNonLienarScale(scaledTimes: ITime[]): ITime[] {
	let unScaledTimes: ITime[] = [];
	if (!scaledTimes || scaledTimes.length === 0) {
		return [];
	}
	unScaledTimes.push({
		startTime: 0,
		endTime: _inverseNonlinearScale(scaledTimes[0].endTime - scaledTimes[0].startTime),
	} as ITime);
	for (let i = 1; i < scaledTimes.length; i++) {
		const scaledTimeDistance = (scaledTimes[i]?.startTime ?? 0) - (scaledTimes[i - 1]?.endTime ?? 0);
		const scaledDuration = (scaledTimes[i]?.endTime ?? 0) - (scaledTimes[i]?.startTime ?? 0);

		const unScaledTimeDistance = _inverseNonlinearScale(scaledTimeDistance);
		const unScaledDuration = _inverseNonlinearScale(scaledDuration);

		const unScaledStartTime = unScaledTimes[i - 1].endTime + unScaledTimeDistance;
		const unScaledEndTime = unScaledStartTime + unScaledDuration;

		unScaledTimes.push({ startTime: unScaledStartTime, endTime: unScaledEndTime });
	}

	return unScaledTimes;
}

function _nonlinearScale(n: number): number {
	//return n;
	return 2 * Math.log10(n / 6 + 1);
}

function _inverseNonlinearScale(n: number): number {
	return 6 * (Math.pow(10, n / 2) - 1);
}

export function getEventIconPlacement(X: IInterval[], ic_w: number, offset: number = 40): number[] {
	const overlapTh = 2;
	let optionsY = new Set([-offset + 5, offset + 5, -2 * offset, 2 * offset + 10]);
	let Y: number[] = [];

	Y.push(offset);
	Y.push(-offset);
	Y.push(-2 * offset);
	for (let i = 3; i < X.length; i++) {
		let x = X[i].x1;
		// find the overlapped neighbors
		let overlappedY = new Set();
		for (let j = i - 1; j > i - 4; j--) {
			if (x - X[j].x1 - overlapTh < ic_w) {
				overlappedY.add(Y[j]);
			}
		}
		// find the first empty position
		let diffY = [...optionsY].filter((y) => !overlappedY.has(y));
		Y.push(diffY[0]);
	}
	return Y;
}

export function pascalCase(key: string): string {
	let newKey: string = key;
	if (key.includes("_")) {
		let keyParts: string[] = key.split("_");
		newKey =
			(keyParts?.[0]?.charAt(0)?.toUpperCase() ?? "") +
			keyParts?.[0]?.slice(1) +
			keyParts?.[1]?.charAt(0).toUpperCase() +
			keyParts?.[1]?.slice(1);
	} else {
		newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1);
	}
	return newKey;
}

export function getEnclosedEvents(x1: number, x2: number, X: IInterval[], events: IEvent[]) {
	let enEvents: IEvent[] = [];
	let enX: IInterval[] = [];
	let firstIdx = -1;
	for (let i = 0; i < X.length; i++) {
		if (X[i].x1 > x1 && X[i].x1 < x2) {
			firstIdx = firstIdx >= 0 ? firstIdx : i;
			enEvents.push(events[i]);
			enX.push(X[i]);
		}
	}
	return { events: enEvents, X: enX, idx: firstIdx };
}

export function time2Pixel(times: ITime[], scale: number): IInterval[] {
	let X: IInterval[] = [];

	times.forEach((time) => {
		X.push({ x1: scale * time.startTime, x2: scale * time.endTime });
	});

	return X;
}

export function pixel2Time(X: IInterval[], scale: number): ITime[] {
	let times: ITime[] = [];

	X.forEach((x) => {
		times.push({ startTime: x.x1 / scale, endTime: x.x2 / scale });
	});

	return times;
}

export function findTimeOverlap(startTimes: number[], endTimes: number[], timestamps: ITime[]): number[] {
	let idxList: number[] = [];

	for (let i = 0; i < startTimes.length; i++) {
		for (let j = 0; j < timestamps.length; j++) {
			if (startTimes[i] >= timestamps[j].startTime && endTimes[i] <= timestamps[j].endTime) {
				idxList.push(j);
			}
		}
	}

	return idxList;
}


export function getRandomNumList(randNum: number, maxNum: number) {
	let numList: number[] = []

	let maxIteration = 1000;
	let i = 0;
	while (numList.length < maxNum || i > maxIteration) {
		let randomIdx = Math.round(Math.random() * maxNum)
		if (!numList.includes(randomIdx)) {
			numList.push(randomIdx)
			if (numList.length == randNum) {
				break;
			}
		}

		i += 1;
	}

	return numList

}


export function sortDataTypes(data: any[]) {
	let sortedData = []
	sortedData.push(data[0])

	for (let i=1; i < data.length; i++) {
		let inserted = false;
		if (data[i].type === "Relaxing") {
			continue;
		}
		for (let j=0; j < sortedData.length; j++) {
			if (data[i].type < sortedData[j].type) {
				sortedData.splice(j, 0, data[i]);
				inserted = true;
				break;
			}
		}
		if (!inserted) { 
			sortedData.push(data[i]);
		} 
	}

	return sortedData;
}


export function getData(data: any[], dataPerClassNum: number, classNum: number, samplesPerClass: number) {

	// data is sorted with respect to activty type

	let sampledData: any[] = [];
	let restOfData: any[] = [];

	for (let k=0; k < classNum; k++) {
		const samplesIdx = getRandomNumList(dataPerClassNum, samplesPerClass);
		// samples per class
		for (let i =0; i < samplesPerClass; i++) {
			if (samplesIdx.includes(i)) {
				sampledData.push(data[i+k*samplesPerClass]);
			} else {
				restOfData.push(data[i+k*samplesPerClass]);
			}
		}
	}	

	return {"sampledData": sampledData, "restOfData": restOfData};
}





interface ITime {
    startTime: number,
    endTime: number
}

interface IInterval {
    x1: number,
    x2: number
}

export function mergeConsecEvents(timestamps: ITime[], events: string[], mergeTh: number) {

    let newTimestamps: ITime[] = [];
    let newEvents: string[] = [];

    if (!timestamps || !events || timestamps.length === 0) {
        return null;
    }

    let newStartTime: number = timestamps?.[0]?.startTime ?? 0;
    for (let i = 1; i < timestamps.length; i++) {
        let currentTime: number = timestamps[i]?.startTime ?? -1;
        let prevTime: number = timestamps[i - 1]?.endTime ?? -1;
        if ((currentTime - prevTime > mergeTh) || (events[i] !== events[i - 1])) {
            newTimestamps.push({ startTime: newStartTime, endTime: timestamps[i - 1]?.endTime ?? 0 });
            newStartTime = timestamps[i]?.startTime ?? 0;
            newEvents.push(events[i] ?? "");
        }
    }

    return { times: newTimestamps, events: newEvents };
}

export function mergeCloseEvents(timestamps: ITime[], events: string[], mergeTh: number) {
    let times = [...timestamps];
    let newTimestamps: ITime[] = [];
    let newEvents: string[] = [];

    let lastCluster: number[] = [];
    let allClusters: number[] = [];

    for (let i = 0; i < times.length - 1; i++) {
        if (allClusters.includes(i)) {
            continue; // skip ones that are examined already
        }
        lastCluster = [i];
        allClusters.push(i);

        for (let j = i; j < times.length - 1; j++) { // find the next cluster
            let lastIdx = lastCluster[lastCluster.length - 1] ?? 0;
            let dt = (times[j + 1]?.startTime ?? 0) - (times[lastIdx ?? 0]?.endTime ?? 0);
            if (dt > mergeTh) {
                // collect the last result
                let t1: number = times[lastCluster[0] ?? 0]?.startTime ?? 0;
                let t2: number = times[lastCluster[lastCluster.length - 1] ?? 0]?.endTime ?? 0;
                newTimestamps.push({ startTime: t1, endTime: t2 });
                newEvents.push(events[lastIdx] ?? "")
                break;
            } else { // next event is close enough
                if (events[j + 1] === events[lastIdx]) { // same event
                    lastCluster.push(j + 1);
                    allClusters.push(j + 1);
                }
            }
        }
    }

    return { "times": newTimestamps, "events": newEvents };
}

export function scaleTimes(timestamps: ITime[]): ITime[] | null {

    if (!timestamps) {
        return null;
    }

    let newTimestamps: ITime[] = [];

    let duration: number = 0;
    let timeDistance: number = 0;
    newTimestamps.push({ startTime: timestamps[0]?.startTime, endTime: timestamps[0]?.endTime } as ITime)
    for (let i = 1; i < timestamps.length; i++) {
        timeDistance = (timestamps[i]?.startTime ?? 0) - (timestamps[i - 1]?.endTime ?? 0); // old time distance
        timeDistance = timeDistance > 0 ? timeDistance : 0
        let newStartTime = (newTimestamps[i - 1]?.endTime ?? 0) + nonlinearScale(timeDistance / 2); // new startTime
        duration = (timestamps[i]?.endTime ?? 0) - (timestamps[i]?.startTime ?? 0); // old duration
        duration = duration > 0 ? duration : 0
        newTimestamps.push({ startTime: newStartTime, endTime: newStartTime + nonlinearScale(duration) })
    }

    return newTimestamps;

}

function nonlinearScale(n: number) {
    //return n;
    return 2 * Math.log10(n / 6 + 1)
}

export function getEventIconPlacement(X: IInterval[], ic_w: number): number[] {
    const offset = 30;
    const overlapTh = 2;
    let optionsY = new Set([-offset + 5, offset + 5, -2 * offset - 5 + 5, 2 * offset + 5 + 5]);
    let Y: number[] = [];

    Y.push(offset);
    Y.push(2 * offset);
    Y.push(-offset);
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
        let diffY = [...optionsY].filter(y => !overlappedY.has(y));
        Y.push(diffY[0]);
    }
    return Y;
};


export function pascalCase(key: string): string {
    let newKey: string = key;
    if (key.includes("_")) {
        let keyParts: string[] = key.split("_");
        newKey = (keyParts?.[0]?.charAt(0)?.toUpperCase() ?? "") + keyParts?.[0]?.slice(1) + keyParts?.[1]?.charAt(0).toUpperCase() + keyParts?.[1]?.slice(1);
    } else {
        newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1)
    }
    return newKey;
}

export function getEnclosedEvents(x1: number, x2: number, X: number[], events: string[]) {
    let enEvents: string[] = []
    let limitsIdx: number[] = [];
    for (let i = 0; i < X.length; i++) {
        if (X[i] > x1 && X[i] < x2) {
            limitsIdx.push(i);
            enEvents.push(events[i])
        }
    }
    return { "events": enEvents, "X": X };
}

export function time2Pixel(times: ITime[], scale: number): IInterval[] {
    let X: IInterval[] = [];

    times.forEach(time => {
        X.push({ x1: scale * time.startTime, x2: scale * time.endTime })
    })

    return X;
}

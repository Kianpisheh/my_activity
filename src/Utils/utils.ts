
interface ITime {
    startTime: number,
    endTime: number
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

    // while (times.length) {
    //     for (let i = 1; i < times.length; i++) {
    //         let d: number = (times[i]?.startTime ?? 0) - (times[i - 1]?.endTime ?? 0);
    //         if (d < mergeTh || !lastCluster.length) {
    //             lastCluster.push(i);
    //             allClusters.push(i);
    //         } else if (lastCluster[0] && lastCluster[lastCluster.length - 1]) {
    //             let t1: number = times[lastCluster[0]]?.startTime ?? 0;
    //             let idx: number = lastCluster.length - 1;
    //             let t2: number = times[idx]?.endTime ?? 0;
    //             newTimestamps.push({ startTime: t1, endTime: t2 } as ITime)
    //             lastCluster = [];
    //         }
    //     }
    // }
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

export function getEventIconPlacement(times: ITime[], scale: number, ic_w: number) {
    const offset = 30;
    const overlapTh = 2;
    let optionsY = new Set([-offset + 5, offset + 5, -2 * offset - 5 + 5, 2 * offset + 5 + 5]);
    let X: number[] = [];
    let Y: number[] = [];

    Y.push(offset);
    Y.push(2 * offset);
    Y.push(-offset);
    X.push(scale * times[0].startTime);
    X.push(scale * times[1].startTime);
    X.push(scale * times[2].startTime);
    for (let i = 3; i < times.length; i++) {
        let x = scale * times[i].startTime;
        // find the overlapped neighbors
        let overlappedY = new Set();
        for (let j = i - 1; j > i - 4; j--) {
            if (x - X[j] - overlapTh < ic_w) {
                overlappedY.add(Y[j]);
            }
        }
        // find the first empty position
        let diffY = [...optionsY].filter(y => !overlappedY.has(y));
        Y.push(diffY[0]);
        X.push(x);
    }

    // const offset = 28;
    // let y0 = offset;
    // for (let i = 0; i < times.length; i++) {
    //     let y = offset;
    //     let x = scale * times[i].startTime;
    //     if (i > 2) {
    //         let x0 = scale * times[i - 2].startTime;
    //         if ((x - x0 < ic_w) && (y === y0)) {
    //             if (y0 === offset) {
    //                 y = -offset;
    //             } else if (y0 === -offset) {
    //                 y = offset
    //             }
    //         }
    //     }
    //     X.push(x);
    //     Y.push(y);
    //     y0 = y;
    // }

    return Y;
};



    // let X = [];
    // let Y = [];
    // const offset = 28;
    // let y0 = offset;
    // for (let i = 0; i < times.length; i++) {
    //     let y = offset;
    //     let x = scale * times[i].startTime;
    //     if (i > 2) {
    //         let x0 = scale * times[i - 2].startTime;
    //         let x1 = scale * times[i - 1].startTime;
    //         if ((x - x0 < ic_w) && (y === y0)) {
    //             if (y0 === offset) {
    //                 y = -offset;
    //             } else if (y0 === -offset) {
    //                 y = offset
    //             }
    //         }
    //     }
    //     X.push(x);
    //     Y.push(y);
    //     y0 = y1;
    //     y1 = y;
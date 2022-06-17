import { useState } from "react";

import "./ActivityInstanceVis.css";
import "./TimeAxis.css";

import TimeAxis from "./TimeAxis";

import {
    mergeConsecEvents,
    nonLinearScale,
    mergeCloseEvents,
    getEventIconPlacement,
    getEnclosedEvents,
    time2Pixel,
    pixel2Time,
    inverseNonLienarScale,
} from "../../Utils/utils";

import EventFilter from "./EventFilter";
import EventIconThumb from "./EventIconThumb";
import ScalingTab from "./ScalingTab";
import RegionSelect from "react-region-select";

function ActivityInstanceVis(props) {
    const [count, setCount] = useState(0);
    const { activity, config, highlighted } = props;
    const [filters, setFilters] = useState("");
    const [regions, setRegions] = useState([]);
    const [selected, setSelected] = useState({});

    const { ic_w, scale, merge_th, nonlScale } = config;

    if (!activity) {
        return null;
    }
    const timestamps = activity.getTimes();

    function handleNewFilter(f) {
        setFilters(f);
    }

    let predActivity = props.predictedActivity;
    if (!predActivity) {
        predActivity = "Unknown";
    }

    let mergedConsecRes = mergeConsecEvents(
        timestamps,
        activity.getEventList(),
        merge_th
    );

    // merge close consecutive events
    const mergedConsecEvents = mergedConsecRes["events"];
    const mergedConsecTimes = mergedConsecRes["times"];

    // nonliniear scaling
    const nonlinearScaledTimes = nonlScale
        ? nonLinearScale(mergedConsecTimes)
        : mergedConsecTimes;
    const thumbX = time2Pixel(nonlinearScaledTimes, scale[0]);

    // merge close events
    let merged = mergeCloseEvents(nonlinearScaledTimes, mergedConsecEvents, 2);
    const mergedCloseTimes = merged["times"];
    const mergedCloseEvents = merged["events"];
    const iconX = time2Pixel(mergedCloseTimes, scale[0]);
    const iconY = getEventIconPlacement(iconX, ic_w);

    const { x1, x2 } = selected;

    let enEventsRes = null;
    let enEvents = null;
    let enX = null;
    let nonScaledEnclosedTimes = null;
    let nonScaledEnclosedThumbX = null;
    let nonScaledIconY = null;
    let firstIdxEnEvent = 0;
    if (selected && x2 - x1 > 0 && Object.keys(selected).length !== 0) {
        enEventsRes = getEnclosedEvents(x1, x2, thumbX, mergedConsecEvents);
        enEvents = enEventsRes["events"];
        enX = enEventsRes["X"];
        firstIdxEnEvent = enEventsRes["idx"]
        let enTimes = pixel2Time(enX, scale[1]);

        nonScaledEnclosedTimes = nonlScale
            ? inverseNonLienarScale(enTimes)
            : enTimes;
        nonScaledEnclosedThumbX = time2Pixel(nonScaledEnclosedTimes, scale[1]);
        nonScaledIconY = getEventIconPlacement(nonScaledEnclosedThumbX, ic_w);
    }

    const mainDivHeight = Object.keys(selected).length !== 0 ? 500 : 360;

    return (
        <div
            className="activity-vis-container"
            style={{ height: mainDivHeight }}
        >
            <div id="title" style={{ fontSize: 12 }}>
                Activity events
            </div>
            <div
                className="graph-container"
                onMouseUp={() => setCount(count + 1)}
            >
                <div className="tools-div">
                    <EventFilter
                        onNewFilter={handleNewFilter}
                        filters={filters}
                    ></EventFilter>
                    <ScalingTab
                        key={1}
                        idx={0}
                        onScaleChange={props.onScaleChange}
                    ></ScalingTab>
                </div>
                <div
                    className="graph"
                    style={{
                        width: Math.ceil(thumbX[thumbX.length - 1].x2),
                    }}
                    onMouseUp={() =>
                        handleRegionSelection(
                            regions,
                            Math.ceil(thumbX[thumbX.length - 1].x2)
                        )
                    }
                >
                    <RegionSelect
                        maxRegions={1}
                        regions={regions}
                        constraint
                        onChange={(regions) => setRegions(regions)}
                        style={{ height: "100%" }}
                    >
                        <EventIconThumb
                            key={1}
                            idx={0}
                            config={config}
                            filters={filters}
                            eventIndividuals={activity.getEventIndividuals()}
                            explanationEvents={highlighted}
                            thumbEvents={mergedConsecEvents}
                            thumbX={thumbX}
                            iconEvents={mergedCloseEvents}
                            iconX={iconX}
                            iconY={iconY}
                        ></EventIconThumb>
                    </RegionSelect>
                </div>
                {selected.x1 && (
                    <div
                        className="graph"
                        style={{
                            width: Math.ceil(
                                nonScaledEnclosedThumbX[
                                    nonScaledEnclosedThumbX.length - 1
                                ].x2
                            ),
                            height: 300,
                        }}
                    >
                        {/* <div className="tools-div">
                        <EventFilter
                            onNewFilter={handleNewFilter}
                            filters={filters}
                        ></EventFilter>
                        <ScalingTab
                            key={2}
                            idx={1}
                            onScaleChange={props.onScaleChange}
                        ></ScalingTab>
                    </div> */}
                        <EventIconThumb
                            key={2}
                            idx={1}
                            config={config}
                            filters={filters}
                            eventIndividuals={activity.getEventIndividuals()}
                            explanationEvents={highlighted}
                            thumbEvents={enEvents}
                            thumbX={nonScaledEnclosedThumbX}
                            iconEvents={enEvents}
                            iconX={nonScaledEnclosedThumbX}
                            iconY={nonScaledIconY}
                        ></EventIconThumb>
                        <TimeAxis
                            tmax={
                                nonScaledEnclosedTimes[
                                    nonScaledEnclosedTimes.length - 1
                                ].endTime
                            }
                            t0={mergedConsecTimes[firstIdxEnEvent].startTime}
                            config={config}
                        ></TimeAxis>
                    </div>
                )}
            </div>
            <div
                style={{
                    fontSize: 13,
                    backgroundColor: "#CFC9B9",
                    padding: 7,
                    margin: 0,
                }}
            >
                <span style={{ color: "#614E1E" }}>Predicted activity:</span>{" "}
                <span style={{ color: "#F63B3B" }}>{predActivity}</span>
            </div>
        </div>
    );

    function handleRegionSelection(regions, svgWidth) {
        if (regions[0]) {
            const x1 = (regions[0].x * svgWidth) / 100;
            const x2 = ((regions[0].x + regions[0].width) * svgWidth) / 100;
            if (x2 - x1 > 0) {
                setSelected({ x1: x1, x2: x2 });
            }
        }
    }
}

export default ActivityInstanceVis;

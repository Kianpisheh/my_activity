import { useState } from "react";

import "./ActivityInstanceVis.css";

import EventIcons from "../../Utils/EventIcons";
import {
    mergeConsecEvents,
    scaleTimes,
    mergeCloseEvents,
    getEventIconPlacement,
    pascalCase,
    getEnclosedEvents,
    time2Pixel
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

    const { ic_w, ic_h, scale, merge_th, nonlScale, r, rc_h } = config;


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
    const nonlinearScaledTimes = nonlScale ? scaleTimes(mergedConsecTimes) : mergedConsecTimes;
    const thumbX = time2Pixel(nonlinearScaledTimes, scale);

    // merge close events
    let merged = mergeCloseEvents(nonlinearScaledTimes, mergedConsecEvents, 2);
    const mergedCloseTimes = merged["times"];
    const mergedCloseEvents = merged["events"];
    const iconX = time2Pixel(mergedCloseTimes, scale);


    const iconY = getEventIconPlacement(iconX, ic_w);

    // const { x1, x2 } = props.selected;
    // if (x1 && x2) {
    //     const enEventsRes = getEnclosedEvents(x1, x2, iconX, mergedCloseEvents);
    //     const enEvents = enEventsRes["events"];
    //     const enX = enEventsRes["X"];
    // }

    return (
        <div className="activity-vis-container">
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
                        onScaleChange={props.onScaleChange}
                    ></ScalingTab>
                </div>
                <div
                    className="graph"
                    style={{
                        width: Math.ceil(config.scale * activity.getMaxTime()),
                    }}
                    onMouseUp={() => handleRegionSelection(regions, Math.ceil(config.scale * activity.getMaxTime()))}
                >
                    <RegionSelect
                        maxRegions={1}
                        regions={regions}
                        constraint
                        onChange={(regions) => setRegions(regions)}
                        style={{ height: "100%" }}
                    >
                        <EventIconThumb
                            config={config}
                            filters={filters}
                            eventIndividuals={activity.getEventIndividuals()}
                            explanationEvents={highlighted}
                            tmax={activity.getMaxTime()}
                            selected={selected}
                            thumbEvents={mergedConsecEvents}
                            thumbX={thumbX}
                            iconEvents={mergedCloseEvents}
                            iconX={iconX}
                            iconY={iconY}
                        ></EventIconThumb>
                    </RegionSelect>
                </div>
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
        console.log({ x1: (regions[0].x * svgWidth) / 100, x2: (regions[0].x + regions[0].width) * svgWidth / 100 });
        setSelected({ x1: (regions[0].x * svgWidth) / 100, x2: (regions[0].x + regions[0].width) * svgWidth / 100 })
    }
}

export default ActivityInstanceVis;


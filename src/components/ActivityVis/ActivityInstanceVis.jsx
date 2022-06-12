import { useState } from "react";

import "./ActivityInstanceVis.css";

import EventIcons from "../../Utils/EventIcons";

import EventFilter from "./EventFilter";
import EventIconThumb from "./EventIconThumb";
import ScalingTab from "./ScalingTab";
import RegionSelect from "react-region-select";

function ActivityInstanceVis(props) {
    const [count, setCount] = useState(0);
    const { activity, config, highlighted } = props;
    const [filters, setFilters] = useState("");
    const [regions, setRegions] = useState([]);

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
                            events={activity.getEventList()}
                            explanationEvents={highlighted}
                            objects={EventIcons}
                            times={timestamps}
                            tmax={activity.getMaxTime()}
                        ></EventIconThumb>
                        {/* <EventDurationThumb
                        config={config}
                        filters={filters}
                        events={activity.getEventList()}
                        times={timestamps}
                        tmax={activity.getMaxTime()}
                    ></EventDurationThumb> */}
                        {/* <TimeAxis
                        config={config}
                        tmax={activity.getMaxTime()}
                    ></TimeAxis> */}
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
        console.log("x1:", regions[0].x * 100);
        console.log("x2:", (regions[0].x + regions[0].width) * 100);
    }
}

export default ActivityInstanceVis;

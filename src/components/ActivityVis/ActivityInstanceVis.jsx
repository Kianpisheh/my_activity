import { useState } from "react";

import "./ActivityInstanceVis.css";

import EventIcons from "../../Utils/EventIcons";

import EventFilter from "./EventFilter";
import EventDurationThumb from "./EventDurationThumb";
import EventIconThumb from "./EventIconThumb";
import ScalingTab from './ScalingTab'
import TimeAxis from './TimeAxis'

function ActivityInstanceVis(props) {
    const { activity, config } = props;
    const [filters, setFilters] = useState("");
    if (!activity) {
        return null;
    }
    const timestamps = activity.getTimes();

    function handleNewFilter(f) {
        setFilters(f);
    }

    console.log("objects: ", EventIcons.getIcons());
    console.log("events: ", activity.getEventList());
    console.log("tmax: ", activity.getMaxTime());

    return (
        <div className="activity-vis-container">
            <div id="title" style={{ fontSize: 12 }}>
                Activity events
            </div>
            <div className="graph-container">
                <div className="tools-div">
                    <EventFilter onNewFilter={handleNewFilter} filters={filters}></EventFilter>
                    <ScalingTab onScaleChange={props.onScaleChange}></ScalingTab>
                </div>
                <div className="graph">
                    <EventIconThumb
                        config={config}
                        filters={filters}
                        events={activity.getEventList()}
                        objects={EventIcons.getIcons()}
                        times={timestamps}
                        tmax={activity.getMaxTime()}
                    ></EventIconThumb>
                    <EventDurationThumb
                        config={config}
                        filters={filters}
                        events={activity.getEventList()}
                        times={timestamps}
                        tmax={activity.getMaxTime()}
                    ></EventDurationThumb>
                    <TimeAxis config={config} tmax={activity.getMaxTime()}></TimeAxis>
                </div>
            </div>
        </div>
    );
}

export default ActivityInstanceVis;

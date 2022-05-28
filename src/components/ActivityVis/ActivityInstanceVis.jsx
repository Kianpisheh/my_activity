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
    const timestamps = activity.getTimes();

    const [filters, setFilters] = useState("");

    function handleNewFilter(f) {
        setFilters(f);
    }

    return (
        <div className="act-instance-vis" style={{ width: config.win_w }}>
            <div className="tools-div">
                <EventFilter onNewFilter={handleNewFilter} filters={filters}></EventFilter>
                <ScalingTab onScaleChange={props.onScaleChange}></ScalingTab>
            </div>
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
    );
}

export default ActivityInstanceVis;

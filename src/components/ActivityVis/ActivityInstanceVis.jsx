import { useState } from "react";

import "./ActivityInstanceVis.css";

import EventIcons from "../../Utils/EventIcons";

import EventFilter from "./EventFilter";
import EventDurationThumb from "./EventDurationThumb";
import EventIconThumb from "./EventIconThumb";
import ScalingTab from './ScalingTab'
import TimeAxis from './TimeAxis'

function ActivityInstanceVis(props) {
    const { activity, config, highlighted } = props;
    const [filters, setFilters] = useState("");
    if (!activity) {
        return null;
    }
    const timestamps = activity.getTimes();

    function handleNewFilter(f) {
        setFilters(f);
    }

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
                        eventIndividuals={activity.getEventIndividuals()}
                        events={activity.getEventList()}
                        explanationEvents={highlighted}
                        objects={EventIcons}
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

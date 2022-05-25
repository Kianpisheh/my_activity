import "./ActivityInstanceVis.css";

import EventFilter from "./EventFilter";
import TimeAxis from "./TimeAxis";
import EventDurationThumb from "./EventDurationThumb";
import EventIconThumb from "./EventIconThumb";
import EventIcons from "../Utils/EventIcons";

function ActivityInstanceVis(props) {
    const { activity, config } = props;
    const timestamps = activity.getTimes();

    return (
        <div className="act-instance-vis" style={{ width: config.win_w }}>
            <div className="tools-div">
                <EventFilter></EventFilter>
                <button id="zoom_in_btn"></button>
            </div>

            <EventIconThumb
                config={config}
                events={activity.getEventList()}
                objects={EventIcons.getIcons()}
                times={timestamps}
                tmax={activity.getMaxTime()}
            ></EventIconThumb>
            <EventDurationThumb
                config={config}
                times={timestamps}
                tmax={activity.getMaxTime()}
            ></EventDurationThumb>
            {/* <TimeAxis config={config} tmax={activity.getMaxTime()}></TimeAxis> */}
        </div>
    );
}

export default ActivityInstanceVis;

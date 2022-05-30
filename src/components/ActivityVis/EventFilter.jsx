import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import "./EventFilter.css"

function EventFilter(props) {

    return <div className="event-filter-container" style={{ display: "flex", alignItems: "center" }}>
        <EditText
            className="activtiy-title"
            placeholder="filter"
            value={props.filters}
            onChange={(value) => {
                props.onNewFilter(value);
            }}
        ></EditText>
    </div>
}


export default EventFilter;
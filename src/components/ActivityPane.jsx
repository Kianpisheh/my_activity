
import "./ActivityPane.css"

function ActivityPane(props) {

    return <div className="activity-pane-container">
        <span id="title" style={{ fontSize: 12 }}>Activities</span>
        <div className="activities-container">
            <ul>
                {props.activities.map((activity, idx) => {
                    return <li key={idx} onClick={() => props.onActivitiySelection(activity.getID())}>
                        <text>{activity.name}</text>
                    </li>
                })}
            </ul>
        </div>
        <button className="add-btn" onClick={() => { let x = 1 }}>+</button>
    </div>
}


export default ActivityPane;
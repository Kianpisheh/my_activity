
import "./ActivityPane.css"

import ImagesObject from "./ImagesObject";


function ActivityPane(props) {

    return <div className="activity-pane-container">
        <span id="title" style={{ fontSize: 12 }}>Activities</span>
        <div className="activities-container">
            <ul>
                {props.activities.map((activity, idx) => {
                    return <li key={idx}>
                        <text>{activity.name}</text>
                    </li>
                })}
            </ul>
        </div>
        {/* <input type="image" src={ImagesObject["add_activity_btn"]} alt="add" width={28} height={28}></input> */}
        <button className="add-btn" onClick={() => { let x = 1 }}>+</button>
    </div>
}


export default ActivityPane;
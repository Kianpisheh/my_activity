
import "./ActivityInstancePane.css"

function ActivtityInstancePane(props) {

    return <div className="act-instance-pane-container">
        <span id="title" style={{ fontSize: 12 }}>
            Activity instances
        </span>
        <div className="activity-instances">
            <ul>
                {props.activtiyInstances.map((activity, idx) => {
                    return <li key={idx} onClick={() => { props.onSelectedItemChange(idx, activity.getName()) }}><text>{activity.getName()}</text></li>
                })}
            </ul>
        </div>
    </div>

}


export default ActivtityInstancePane;
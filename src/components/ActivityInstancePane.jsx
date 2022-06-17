
import "./ActivityInstancePane.css"

function ActivtityInstancePane(props) {

    return <div className="act-instance-pane-container">
        <span id="title" style={{ fontSize: 12 }}>
            Activity instances
        </span>
        <div className="activity-instances">
            <ul>
                {props.activtiyInstances.map((activity, idx) => {
                    let style = props.currentActivityId === idx ? { background: "#E3DDCA" } : {}
                    return <li key={idx} style={style} onClick={() => { props.onSelectedItemChange(idx, activity.getName()) }}><text>{activity.getName()}</text></li>
                })}
            </ul>
        </div>
    </div>

}


export default ActivtityInstancePane;
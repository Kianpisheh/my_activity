import ImagesObject from "./ImagesObject";
import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";

function TimeDistanceInteraction(props) {
    let events = props.data.events;

    let axiomText = "";
    if (props.data.th1 !== null) {
        axiomText += props.data.th1 + " <"
    }
    axiomText += " duration";
    if (props.data.th2 !== null) {
        axiomText += " < " + props.data.th2;
    }

    return (
        <div className="time-distance-axiom">
            <AdjustableTime
                data={props.data}
                title="more than"
                messageCallback={props.messageCallback}
            ></AdjustableTime>
            <div className="mid-section">
                <div className="time-distance-icons">
                    <img
                        width={30}
                        height={30}
                        src={ImagesObject[events[0]]}
                        alt="XX"
                    ></img>
                    <img width={60} src={ImagesObject["time_distance"]} alt="XX"></img>
                    <img
                        width={30}
                        height={30}
                        src={ImagesObject[events[1]]}
                        alt="XX"
                    ></img>
                </div>
                <span style={{ fontSize: 12 }}>{axiomText}</span>
            </div>
            <AdjustableTime
                data={props.data}
                title="less than"
                messageCallback={props.messageCallback}
            ></AdjustableTime>
        </div>
    );
}

export default TimeDistanceInteraction;

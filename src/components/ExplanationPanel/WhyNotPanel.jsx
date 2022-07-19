import "./WhyNotPanel.css";

import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";
import { CircleNum } from "./utils";

function WhyNotPanel(props) {
    const { axioms } = props;
    if (!axioms) {
        return;
    }
    if (!Object.keys(axioms).length) {
        return;
    }

    // first create interaction axiom elements
    let iAxioms = [];
    for (const [ax, indeces] of Object.entries(axioms)) {
        let numAxioms = indeces.length;
        if (ax.split(":")[0] === "interaction") {
            const Icon = Icons.getIcon(pascalCase(ax.split(":")[1]), true);
            iAxioms.push(
                <div
                    key={ax.split(":")[1] + "ic1"}
                    className="interaction-icon-container"
                    onMouseOver={() => props.onHoverAxiom(indeces)}
                >
                    <Icon
                        key={ax}
                        style={{
                            width: 22,
                            height: 22,
                            fill: "#3A2A0D",
                        }}
                    ></Icon>
                    <div className="temp-ax-num">{CircleNum(numAxioms)}</div>
                </div>
            );
        }
    }

    // now create temporal axiom elements
    let tAxioms = [];
    let i = 0;
    for (const [ax, indeces] of Object.entries(axioms)) {
        const TimeDistIcon = Icons.getIcon("TimeDistance");
        const numAxioms = indeces.length;
        if (ax.split(":")[0] === "time_distance") {
            const Icon1 = Icons.getIcon(pascalCase(ax.split(":")[1]), true);
            const Icon2 = Icons.getIcon(pascalCase(ax.split(":")[2]), true);
            tAxioms.push(
                <div key={i + "t_div"} className="why-not-time-distance-axiom">
                    <div
                        key={i + "ic1"}
                        className="time-dist-icons-container"
                        onMouseOver={() => props.onHoverAxiom(indeces)}
                        onMouseLeave={() => props.onHoverAxiom([])}
                    >
                        <Icon1
                            key={i + "ic1"}
                            style={{
                                width: 22,
                                height: 22,
                                fill: "#3A2A0D",
                            }}
                        ></Icon1>
                        <TimeDistIcon
                            style={{
                                width: 65,
                                height: 30,
                                marginTop: "-8px",
                                fill: "#3A2A0D",
                            }}
                        ></TimeDistIcon>
                        <Icon2
                            key={i + "ic2"}
                            style={{
                                width: 22,
                                height: 22,
                                fill: "#3A2A0D",
                            }}
                        ></Icon2>
                    </div>
                    <div className="temp-ax-num">{CircleNum(numAxioms)}</div>
                </div>
            );
        } else if (ax.split(":")[0] === "duration") {
            const Icon1 = Icons.getIcon(pascalCase(ax.split(":")[1]), true);
            tAxioms.push(
                <div key={i + "t_div"} className="why-not-duration-axiom">
                    <div
                        key={i + "ic1"}
                        className="duration-icons-container"
                        onMouseOver={() => props.onHoverAxiom(indeces)}
                        onMouseLeave={() => props.onHoverAxiom([])}
                    >
                        <Icon1
                            key={i + "ic1dd"}
                            style={{
                                width: 22,
                                height: 22,
                                fill: "#3A2A0D",
                            }}
                        ></Icon1>
                        <TimeDistIcon
                            style={{
                                width: 65,
                                height: 30,
                                marginTop: "-8px",
                                fill: "#3A2A0D",
                            }}
                        ></TimeDistIcon>
                    </div>
                    <div className="temp-ax-num">{CircleNum(numAxioms)}</div>
                </div>
            );
        }
        i += 1;
    }

    return (
        <div className="why-not-panel-container">
            <div className="why-not-interaction-axioms">{iAxioms}</div>
            {tAxioms}
        </div>
    );
}

export default WhyNotPanel;

import "./TimeDistanceAxiomRepr.css"

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum } from "../AxiomPane/Axiom";

import isEqual from "lodash.isequal";

import AxiomData from "../../model/AxiomData";

function InteractionAxiomRepr(props) {
	const events = props.axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);

	// dimentions
	const w = 350;
	const h = 50;
	const icSize = 25;
	const xIcon1 = w / 2 - icSize / 2;
	const yIcon = icSize / 2;

    const br = props.selectedWhys === props.idx ? "solid" : "none";

	// check if this is an unsatisfied axiom based on the user query
	const numnum = getWhyNotNum(
		props.unsatisfiedAxioms,
		props.axiom,
		props.onWhyNotWhatQuery,
		props.onWhyNotNumHover,
		props.queryTrigger,
		props.qmenuPos
	);

    let selFNIds = [];
    for (const [axiomString, ids] of Object.entries(props.unsatisfiedAxioms)) {
		const ax = AxiomData.axiomFromString(axiomString);
		if (isEqual(ax, props.axiom)) {
            selFNIds = [...ids];
            break;
        }
    }

	return (
		<div
			className="time-distance-axiom-repr"
			style={{ cursor: "pointer", border: br }}
			onClick={() => props.onWhySelection(props.idx)}
            onMouseOver={() => props.onWhyNotNumHover(selFNIds)}
			onMouseLeave={() => props.onWhyNotNumHover([])}
		>
			<svg width={w} height={h}>
				<Icon1
					x={xIcon1}
					y={yIcon}
					key={"time-dist-1-repr"}
					width={icSize}
					height={icSize}
					fill={"#3A2A0D"}
				></Icon1>
			</svg>
			<div id="num-div">{!props.whyQueryMode && numnum}</div>
		</div>
	);
}

export default InteractionAxiomRepr;

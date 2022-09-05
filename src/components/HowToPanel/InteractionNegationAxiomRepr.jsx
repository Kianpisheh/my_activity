import "./TimeDistanceAxiomRepr.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum } from "../AxiomPane/Axiom";

import isEqual from "lodash.isequal";

import AxiomData from "../../model/AxiomData";

function InteractionNegationAxiomRepr(props) {
	const events = props.axiom.getEvents();

	// dimentions
	const icSize = 25;
	const br = props.selectedWhys === props.idx ? "solid" : "none";

	// check if this is an unsatisfied axiom based on the user query
	let numnum = null;
	let selFNIds = [];
	if (props.unsatisfiedAxioms) {
		numnum = getWhyNotNum(
			props.unsatisfiedAxioms,
			props.axiom,
			props.onWhyNotWhatQuery,
			props.onWhyNotNumHover,
			props.queryTrigger,
			props.qmenuPos
		);

		for (const [axiomString, ids] of Object.entries(props.unsatisfiedAxioms)) {
			const ax = AxiomData.axiomFromString(axiomString);
			if (isEqual(ax, props.axiom)) {
				selFNIds = [...ids];
				break;
			}
		}
	}

	return (
		<div
			className="time-distance-axiom-repr"
			style={{
				cursor: "pointer",
				border: br,
				columnGap: 30,
				height: 50,
				diplay: "flex",
				justifyContent: "center",
			}}
			onClick={() => props.onWhyNotAxiomClick()}
			onMouseOver={() => props.onWhyNotNumHover(selFNIds)}
			onMouseLeave={() => props.onWhyNotNumHover([])}
			onMouseEnter={(ev) => {
				const domRect = ev.target.getBoundingClientRect();
				props.onWhyHover(domRect.x + domRect.width, domRect.y, props.axiom);
			}}
		>
			{events.map((ev) => {
				const Icon = Icons.getIcon(pascalCase(ev), true);
				const NotIcon = Icons.getIcon("NotFound");

				return (
					<svg width={icSize} height={icSize}>
						<Icon key={"time-dist-1-repr"} width={icSize} height={icSize} fill={"#3A2A0D"}></Icon>
						<NotIcon
							key={"time-dist-1-repr"}
							width={icSize}
							height={icSize}
							fill={"red"}
							opacity={0.7}
						></NotIcon>
					</svg>
				);
			})}

			<div id="num-div">{!props.whyQueryMode && numnum}</div>
		</div>
	);
}

export default InteractionNegationAxiomRepr;

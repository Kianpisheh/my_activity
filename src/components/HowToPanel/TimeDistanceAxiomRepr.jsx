import "./TimeDistanceAxiomRepr.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum } from "../AxiomPane/Axiom";
import isEqual from "lodash.isequal";

import AxiomData from "../../model/AxiomData";
import QueryTrigger from "../../model/QueryTrigger";

function TimeDistanceAxiomRepr(props) {
	const th1 = props.axiom.getTh1();
	const th2 = props.axiom.getTh2();
	const events = props.axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);

	// dimentions
	const w = 350;
	const h = 50;
	const icSize = 25;
	const lineSize = 90;
	const xIcon1 = w / 4 - lineSize / 2 - icSize - 10;
	const xIcon2 = w / 4 + lineSize / 2 + 10;
	const yIcon = icSize / 2;

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
			style={{ cursor: "pointer", border: br }}
            onClick={() => props.onWhyNotAxiomClick()}
			onMouseOver={(ev) => {
                props.onWhyNotNumHover(selFNIds);
            }}
            onMouseEnter={(ev)=> {
                const domRect = ev.target.getBoundingClientRect();
                props.onWhyHover(domRect.x + domRect.width, domRect.y, props.axiom);
            }}
			onMouseLeave={() => {
                props.onWhyNotNumHover([]);}
            }
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
				<Icon2
					x={xIcon2}
					y={yIcon}
					key={"time-dist-2-repr"}
					width={icSize}
					height={icSize}
					fill={"#3A2A0D"}
				></Icon2>
				<line
					y1={icSize + 5}
					x1={w / 4 - lineSize / 2}
					x2={w / 4 + lineSize / 2}
					y2={icSize + 5}
					stroke="#777777"
					strokeWidth={1}
                    strokeDasharray={4}
				></line>
				<polygon
					points={[
						w / 4 + lineSize / 2,
						icSize + 5,
						w / 4 + lineSize / 2 - 5,
						icSize + 2,
						w / 4 + lineSize / 2 - 5,
						icSize + 8,
					]}
					fill="#777777"
					stroke="#777777"
					strokeWidth={1}
				/>
				<line y1={0} x1={(5.5 * w) / 10} x2={(5.5 * w) / 10} y2={h} stroke="#777777" strokeWidth={1}></line>
				<text x={w / 2 + 40} y={h / 2 - 7} fontSize={12} fill="#555555">
					more than {th1} sec
				</text>
				<text x={w / 2 + 40} y={h / 2 + 12} fontSize={12} fill="#555555">
					less than {th2} sec
				</text>
			</svg>
			<div id="num-div">{!props.whyQueryMode && numnum}</div>
		</div>
	);
}

export default TimeDistanceAxiomRepr;

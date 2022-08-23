import "./DurationAxiomRepr.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum } from "../AxiomPane/Axiom";

function DurationAxiomRepr(props) {
	const th1 = props.axiom.getTh1();
	const th2 = props.axiom.getTh2();
	const events = props.axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);

	// dimentions
	const w = 360;
	const h = 50;
	const icSize = 25;
	const lineSize = 100;
	const xIcon1 = w / 6 - icSize / 2;
	const yIcon = 0;

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

	return (
		<div
			className="duration-axiom-repr"
			style={{ cursor: "pointer", border: br }}
			onClick={() => props.onWhySelection(props.idx)}
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
				<line
					y1={icSize + 5}
					x1={w / 6 - lineSize / 2}
					x2={w / 6 + lineSize / 2}
					y2={icSize + 5}
					stroke="#555555"
					strokeWidth={1}
				></line>
				<polygon
					points={[
						w / 6 - lineSize / 2,
						icSize + 5,
						w / 6 - lineSize / 2 - 5,
						icSize + 2,
						w / 6 - lineSize / 2 - 5,
						icSize + 8,
					]}
					fill="#555555"
					stroke="#555555"
					strokeWidth={1}
				/>
				<polygon
					points={[
						w / 6 + lineSize / 2,
						icSize + 5,
						w / 6 + lineSize / 2 + 5,
						icSize + 2,
						w / 6 + lineSize / 2 + 5,
						icSize + 8,
					]}
					fill="#555555"
					stroke="#555555"
					strokeWidth={1}
				/>
				<line y1={0} x1={(5.5 * w) / 10} x2={(5.5 * w) / 10} y2={h} stroke="#555555" strokeWidth={1}></line>
				<text x={w / 2 + 40} y={h / 2 - 12} fontSize={12}>
					more than {th1} sec
				</text>
				<text x={w / 2 + 40} y={h / 2 + 12} fontSize={12}>
					less than {th2} sec
				</text>
			</svg>
			<div id="num-div">{!props.whyQueryMode && numnum}</div>
		</div>
	);
}

export default DurationAxiomRepr;

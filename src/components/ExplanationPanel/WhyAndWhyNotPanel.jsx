import "./WhyAndWhyNotPanel.css";

import AxiomStats from "./AxiomStats";

import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";
import { CircleNum } from "./utils";

function WhyAndWhyNotPanel(props) {
	const { questionType, axiomStats, currentActivity, ussatisfiedAxioms } = props;

	if (questionType === "") {
		return;
	}
	if (!axiomStats || Object.keys(axiomStats).length === 0) {
		return;
	}

	let comp = null;
	const currActivityAxioms = currentActivity.getAxioms();
	if (questionType === "why") {
		comp = currActivityAxioms.map((ax, idx) => {
			return (
				<div className="ax-stat-container" onClick={() => props.onFPAxiomStatClick(ax, axiomStats[idx])}>
					<AxiomStats
						key={"ax-fp-stat-" + idx}
						stats={axiomStats[idx]}
						axiom={currActivityAxioms[idx]}
					></AxiomStats>
				</div>
			);
		});
	}

	let tAxioms = [];
	let iAxioms = [];
	if (questionType === "why_not") {
		if (!ussatisfiedAxioms) {
			return;
		}
		if (!Object.keys(ussatisfiedAxioms).length) {
			return;
		}

		// first create interaction axiom elements
		for (const [ax, indeces] of Object.entries(ussatisfiedAxioms)) {
			let numAxioms = indeces.length;
			if (ax.split(":")[0] === "interaction") {
				const Icon = Icons.getIcon(pascalCase(ax.split(":")[1]), true);
				iAxioms.push(
					<div
						key={ax.split(":")[1] + "ic1"}
						className="interaction-icon-container"
						onMouseOver={() => props.onWhyNotAxiomHover(indeces)}
						onMouseLeave={() => props.onWhyNotAxiomHover([])}
						onClick={() => props.onAxiomClick(indeces, ax)}
					>
						<Icon key={ax} style={{ width: 22, height: 22, fill: "#3A2A0D" }}></Icon>
						<div className="temp-ax-num">{CircleNum(numAxioms)}</div>
					</div>
				);
			}
		}

		// now create temporal axiom elements
		let i = 0;
		for (const [ax, indeces] of Object.entries(ussatisfiedAxioms)) {
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
							onMouseOver={() => props.onWhyNotAxiomHover(indeces)}
							onMouseLeave={() => props.onWhyNotAxiomHover([])}
							onClick={() => props.onAxiomClick(indeces, ax)}
						>
							<Icon1 key={i + "ic1"} style={{ width: 22, height: 22, fill: "#3A2A0D" }}></Icon1>
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
							onMouseOver={() => props.onWhyNotAxiomHover(indeces)}
							onMouseLeave={() => props.onWhyNotAxiomHover([])}
							onClick={() => props.onAxiomClick(indeces, ax)}
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
	}

	return (
		<div className="why-not-panel-container">
			{/* <div className="why-not-interaction-axioms">{iAxioms}</div> */}
			{comp}
		</div>
	);
}

export default WhyAndWhyNotPanel;

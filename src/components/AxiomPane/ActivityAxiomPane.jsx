import { useState } from "react";
import AxiomManager from "../../model/AxiomManager";
import "./ActivityAxiomPane.css";
import Axiom from "./Axiom";
import AxiomCrafter from "./AxiomCrafter";
import AxiomTypes from "../../model/AxiomTypes";

import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import Icons from "../../icons/Icons";

function ActivityAxiomPane(props) {
	const [definingRule, setDefiningRule] = useState("");
	const [ruleType, setRuleType] = useState(AxiomTypes.TYPE_INTERACTION);

	let axioms = [];
	if (props.activity != null) {
		axioms = props.activity.getAxioms();
	}

	function handleAxiomCreation(data) {
		setDefiningRule("");
		setRuleType(data.type);
		props.sendMessage(AxiomTypes.MSG_AXIOM_CREATION_DONE, data);
	}

	let objectList = [];
	if (ruleType === AxiomTypes.TYPE_INTERACTION) {
		objectList = [...Icons.getEventList()];
	} else if (ruleType === AxiomTypes.TYPE_INTERACTION_NEGATION) {
		objectList = [...Icons.getEventList()].filter((item) => !axioms?.[0]?.getEvents()?.includes(item));
	} else if (ruleType === AxiomTypes.TYPE_TEMPORAL) {
		objectList = AxiomManager.findInteractionObjects([...axioms]);
	}

	console.log(props.activity.name);

	return (
		<div className="ax-container">
			<div className="main-container">
				<div
					id="title-div"
					onBlur={() =>
						props.sendMessage(AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED, {
							id: props.activity["id"],
							title: "value",
						})
					}
				>
					<EditText
						className="activtiy-title"
						value={props.activity.name}
						style={{
							fontSize: 13,
							fontWeight: "600",
							color: "#6a603f",
							backgroundColor: "transparent",
							marginLeft: 0,
							marginTop: 0,
							padding: 0,
						}}
						onChange={(value) =>
							props.sendMessage(AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING, {
								id: props.activity["id"],
								title: value,
							})
						}
						onBlur={() =>
							props.sendMessage(AxiomTypes.MSG_ACTIVITY_TITLE_UPDATED, {
								id: props.activity["id"],
								title: props.activity.name,
							})
						}
					></EditText>
				</div>
				<div className="Axiom-pane">
					<div
						style={{
							display: "flex",
							width: "100%",
							alignContent: "center",
							height: "30px",
						}}
					>
						<span className="sub-section-title" style={{ width: 220 }}>
							Interaction with objects and appliances
						</span>
						<div style={{ display: "flex", marginLeft: 10 }}>
							<button
								className="add-int-btn"
								onClick={() => {
									setRuleType(AxiomTypes.TYPE_INTERACTION);
									setDefiningRule(AxiomTypes.TYPE_INTERACTION);
								}}
							>
								+
							</button>
						</div>
					</div>
					<div className="interaction-axioms-container">
						<Axiom
							idx={0}
							key={0}
							data={axioms[0]}
							config={props.config}
							messageCallback={props.sendMessage}
							onWhyNotWhatQuery={props.onWhyNotWhatQuery}
							onWhyWhatQuery={props.onWhyWhatQuery}
							activityInstances={props.activityInstances}
							onWhyNotNumHover={props.onWhyNotNumHover}
							classificationResult={props.classificationResult}
							activity={props.activity}
							selectedInstancesIdx={props.selectedInstancesIdx}
							onWhyNotHowTo={props.onWhyNotHowTo}
							stats={props.whyNotWhat}
							whyQueryMode={props.whyQueryMode}
							onWhyHowToQuery={props.onWhyHowToQuery}
							ruleitems={props.ruleitems}
							onQuestionMenu={props.onQuestionMenu}
							queryTrigger={props.queryTrigger}
						></Axiom>
					</div>
					<div className="axiom-crafter-container">
						{definingRule === AxiomTypes.TYPE_INTERACTION && (
							<AxiomCrafter
								config={props.config}
								objects={objectList}
								handleAxiomCreation={handleAxiomCreation}
								ruleType={ruleType}
							></AxiomCrafter>
						)}
					</div>
					<hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
					<div
						style={{
							display: "flex",
							width: "100%",
							alignContent: "center",
							height: "30px",
						}}
					>
						<span className="sub-section-title" style={{ width: 270 }}>
							Excluding Interaction with objects and appliances
						</span>
						<div style={{ display: "flex", marginLeft: 10 }}>
							<button
								className="add-int-btn"
								onClick={() => {
									setRuleType(AxiomTypes.TYPE_INTERACTION_NEGATION);
									setDefiningRule(AxiomTypes.TYPE_INTERACTION_NEGATION);
								}}
							>
								+
							</button>
						</div>
					</div>
					<div className="negation-interaction-axioms-container">
						<Axiom
							idx={1}
							key={1}
							data={axioms[1]}
							config={props.config}
							messageCallback={props.sendMessage}
							onWhyNotWhatQuery={props.onWhyNotWhatQuery}
							onWhyWhatQuery={props.onWhyWhatQuery}
							activityInstances={props.activityInstances}
							onWhyNotNumHover={props.onWhyNotNumHover}
							classificationResult={props.classificationResult}
							activity={props.activity}
							selectedInstancesIdx={props.selectedInstancesIdx}
							onWhyNotHowTo={props.onWhyNotHowTo}
							stats={props.whyNotWhat}
							whyQueryMode={props.whyQueryMode}
							onWhyHowToQuery={props.onWhyHowToQuery}
							ruleitems={props.ruleitems}
							onQuestionMenu={props.onQuestionMenu}
							queryTrigger={props.queryTrigger}
						></Axiom>
					</div>
					<div className="axiom-crafter-container">
						{definingRule === AxiomTypes.TYPE_INTERACTION_NEGATION && (
							<AxiomCrafter
								config={props.config}
								objects={objectList}
								handleAxiomCreation={handleAxiomCreation}
								ruleType={ruleType}
							></AxiomCrafter>
						)}
					</div>
					<hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
					<div style={{ display: "flex", width: "100%", alignContent: "center", height: "30px" }}>
						<span className="sub-section-title" style={{ width: 125 }}>
							Temporal conditions
						</span>
						<div style={{ display: "flex", marginLeft: 10 }}>
							<button
								className="add-int-btn"
								onClick={() => {
									setRuleType(AxiomTypes.TYPE_TEMPORAL);
									setDefiningRule("temporal");
								}}
							>
								+
							</button>
						</div>
					</div>
					<div className="temporal-axioms-container">
						{axioms.slice(2).map((axiom, idx) => (
							<Axiom
								idx={idx + 2}
								key={idx + 2}
								data={axiom}
								config={props.config}
								messageCallback={props.sendMessage}
								onWhyNotWhatQuery={props.onWhyNotWhatQuery}
								onWhyWhatQuery={props.onWhyWhatQuery}
								activityInstances={props.activityInstances}
								onWhyNotNumHover={props.onWhyNotNumHover}
								classificationResult={props.classificationResult}
								activity={props.activity}
								selectedInstancesIdx={props.selectedInstancesIdx}
								onWhyNotHowTo={props.onWhyNotHowTo}
								stats={props.whyNotWhat}
								whyQueryMode={props.whyQueryMode}
								onWhyHowToQuery={props.onWhyHowToQuery}
								onQuestionMenu={props.onQuestionMenu}
								queryTrigger={props.queryTrigger}
							></Axiom>
						))}
					</div>{" "}
					<div className="axiom-crafter-container">
						{definingRule === "temporal" && (
							<AxiomCrafter
								config={props.config}
								objects={objectList}
								handleAxiomCreation={handleAxiomCreation}
								ruleType={ruleType}
							></AxiomCrafter>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ActivityAxiomPane;

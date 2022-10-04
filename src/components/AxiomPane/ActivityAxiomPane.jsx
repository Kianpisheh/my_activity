import React, { useState } from "react";
import AxiomManager from "../../model/AxiomManager";
import "./ActivityAxiomPane.css";
import Axiom from "./Axiom";
import AxiomCrafter from "./AxiomCrafter";
import AxiomTypes from "../../model/AxiomTypes";
import Activity from "../../model/Activity";

import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import Icons from "../../icons/objects/Icons";
import AxiomNavBar from "./AxiomNavbar";
import ActivityDefinition from "../../model/ActivityDefinition";
import { logEvent } from "../../APICalls/activityAPICalls";

function ActivityAxiomPane(props) {
	const [definingRule, setDefiningRule] = useState("");
	const [ruleType, setRuleType] = useState(AxiomTypes.TYPE_INTERACTION);
	const [ORIdx, setORIdx] = useState(null);
	const [currAxiomSetIdx, setCurrAxiomSetIdx] = useState(0);
	const [savedFormulas, setSavedFormulas] = useState([]);

	let datasetFormulas = savedFormulas.filter((f) => f.dataset === props.dataset);
	if (currAxiomSetIdx - 1 >= datasetFormulas.length) {
		setCurrAxiomSetIdx(0);
	}

	let axioms = [];
	if (props.activity != null && currAxiomSetIdx === 0) {
		axioms = [...props.activity.getAxioms()];
	}

	if (currAxiomSetIdx > 0) {
		axioms = [...datasetFormulas[currAxiomSetIdx - 1].getAxioms()];
	}

	function handleSaveFormula() {
		const formula = new ActivityDefinition(props.dataset, props.activity.getName(), props.activity.getAxioms());

		// check for duplicate
		for (const formula2 of savedFormulas) {
			if (JSON.stringify(formula2) === JSON.stringify(formula) && formula.dataset === formula2.dataset) {
				return;
			}
		}
		logEvent(formula, "formula", "formula_save", props.dataset + "-" + props.user);
		logEvent([...savedFormulas, formula], "all_formulas", "all_formulas", props.dataset + "-" + props.user);
		setSavedFormulas([...savedFormulas, formula]);
	}

	function handleDeleteFormula() {
		logEvent(savedFormulas[currAxiomSetIdx - 1], "formula", "formula_removal", props.dataset + "-" + props.user);
		logEvent(
			savedFormulas.filter((f, idx) => idx !== currAxiomSetIdx - 1),
			"all_formulas",
			"all_formulas",
			props.dataset + "-" + props.user
		);
		setSavedFormulas(savedFormulas.filter((f, idx) => idx !== currAxiomSetIdx - 1));
		setCurrAxiomSetIdx(currAxiomSetIdx - 1);
	}

	function handleAxiomCreation(data, editOR = false) {
		setDefiningRule("");
		if (data) {
			if (data.type.includes(AxiomTypes.TYPE_TIME_DISTANCE)) {
				setRuleType(AxiomTypes.TYPE_TIME_DISTANCE);
			} else if (data.type.includes(AxiomTypes.TYPE_DURATION)) {
				setRuleType(AxiomTypes.TYPE_DURATION);
			} else {
				setRuleType(data.type);
			}
			if (editOR) {
				props.sendMessage(AxiomTypes.MSG_OR_EVENTS_AXIOM_EDIT, data);
			} else {
				props.sendMessage(AxiomTypes.MSG_AXIOM_CREATION_DONE, data);
			}
			setORIdx(null);
		}
	}

	let objectList = [];
	if (ruleType === AxiomTypes.TYPE_INTERACTION || ruleType === AxiomTypes.TYPE_OR_INTERACTION) {
		objectList = [...Icons.getEventList()];
	} else if (ruleType === AxiomTypes.TYPE_INTERACTION_NEGATION) {
		objectList = [...Icons.getEventList()].filter((item) => !axioms?.[0]?.getEvents()?.includes(item));
	} else if (ruleType === AxiomTypes.TYPE_TEMPORAL) {
		objectList = AxiomManager.findInteractionObjects(axioms);
	}
	objectList.sort();

	let interactionORAxStartIdx = props.activity.getStartIdx(AxiomTypes.TYPE_OR_INTERACTION);
	let interactionORAxLastIdx = props.activity.getLastIdx(AxiomTypes.TYPE_OR_INTERACTION);
	let temporalAxStartIdx = props.activity.getStartIdx(AxiomTypes.TYPE_TEMPORAL);

	if (currAxiomSetIdx > 0) {
		interactionORAxStartIdx = Activity.getStartIdx2(axioms, AxiomTypes.TYPE_OR_INTERACTION);
		interactionORAxLastIdx = Activity.getLastIdx2(axioms, AxiomTypes.TYPE_OR_INTERACTION);
		temporalAxStartIdx = Activity.getStartIdx2(axioms, AxiomTypes.TYPE_TEMPORAL);
	}

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
				<div id="axiom-navbar">
					<AxiomNavBar
						savedFormulasNum={datasetFormulas.length}
						onSave={handleSaveFormula}
						onDelete={handleDeleteFormula}
						onReset={() => props.sendMessage(AxiomTypes.MSG_RESET_ACTIVITY, {})}
						onAxiomSetChange={(idx) => setCurrAxiomSetIdx(idx)}
						currentIdx={currAxiomSetIdx}
					></AxiomNavBar>
				</div>
				<div className="Axiom-pane">
					<div
						style={{
							display: "flex",
							width: "100%",
							alignContent: "center",
							height: "30px",
							alignItems: "center",
							marginBottom: 5,
						}}
					>
						<span className="sub-section-title" style={{ width: 170 }}>
							<p>Must include</p>
							<p
								style={{
									fontWeight: 600,
									color: "#E10B86",
									marginLeft: 3,
								}}
							>
								all
							</p>
							<p style={{ marginLeft: 3 }}>the following</p>
						</span>
						{currAxiomSetIdx === 0 && (
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
						)}
					</div>
					{/* ------------------Interaction Axioms---------------- */}
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
							onWhyNotHover={props.onWhyNotHover}
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
							active={currAxiomSetIdx === 0}
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
					{/* ------------------Interaction negation Axioms---------------- */}
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
						{currAxiomSetIdx === 0 && (
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
						)}
					</div>
					{axioms[1] && axioms[1].getType() === AxiomTypes.TYPE_INTERACTION_NEGATION && (
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
								onWhyNotHover={props.onWhyNotHover}
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
								active={currAxiomSetIdx === 0}
							></Axiom>
						</div>
					)}
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
					{/* ------------------Intreraction OR Axioms---------------- */}
					<hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
					<div style={{ display: "flex", width: "100%", alignItems: "center", height: "30px" }}>
						<span className="sub-section-title" style={{ width: 230 }}>
							<p>Must include</p>
							<p
								style={{
									fontWeight: 600,
									color: "#E10B86",
									marginLeft: 3,
								}}
							>
								at least one
							</p>
							<p style={{ marginLeft: 3 }}> of the follwoing</p>
						</span>
						{currAxiomSetIdx === 0 && (
							<div style={{ display: "flex", marginLeft: 10 }}>
								<button
									className="add-int-btn"
									onClick={() => {
										setRuleType(AxiomTypes.TYPE_OR_INTERACTION);
										setDefiningRule(AxiomTypes.TYPE_OR_INTERACTION);
										setORIdx(props.activity.excludedEvents.length ? 2 : 1);
									}}
								>
									+
								</button>
							</div>
						)}
					</div>
					{interactionORAxStartIdx &&
						axioms.slice(interactionORAxStartIdx, interactionORAxLastIdx).map((axiom, idx) => (
							<React.Fragment>
								<div className="OR-interaction-axioms-container">
									<Axiom
										idx={idx + interactionORAxStartIdx}
										key={idx + interactionORAxStartIdx}
										data={axiom}
										config={props.config}
										messageCallback={props.sendMessage}
										onWhyNotWhatQuery={props.onWhyNotWhatQuery}
										onWhyWhatQuery={props.onWhyWhatQuery}
										activityInstances={props.activityInstances}
										onWhyNotHover={props.onWhyNotHover}
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
										active={currAxiomSetIdx === 0}
									></Axiom>
								</div>
								<div key={idx + "craft"} className="axiom-crafter-container">
									{ORIdx === idx + (props.activity.hasNegation() ? 2 : 1) &&
										definingRule === AxiomTypes.TYPE_OR_INTERACTION && (
											<AxiomCrafter
												key={idx + "craft"}
												config={props.config}
												objects={objectList}
												handleAxiomCreation={handleAxiomCreation}
												ruleType={ruleType}
												axiom={axiom}
												idx={idx}
											></AxiomCrafter>
										)}
								</div>
								<hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
								<div
									style={{
										display: "flex",
										width: "100%",
										alignItems: "center",
										height: "30px",
									}}
								>
									<span className="sub-section-title" style={{ width: 230 }}>
										<p>Must include</p>
										<p
											style={{
												fontWeight: 600,
												color: "#E10B86",
												marginLeft: 3,
											}}
										>
											at least one
										</p>
										<p style={{ marginLeft: 3 }}> of the follwoing</p>
									</span>
									{currAxiomSetIdx === 0 && (
										<div style={{ display: "flex", marginLeft: 10 }}>
											<button
												className="add-int-btn"
												onClick={() => {
													setRuleType(AxiomTypes.TYPE_OR_INTERACTION);
													setDefiningRule(AxiomTypes.TYPE_OR_INTERACTION);
													setORIdx(idx + interactionORAxStartIdx + 1);
												}}
											>
												+
											</button>
										</div>
									)}
								</div>
							</React.Fragment>
						))}
					{ORIdx === interactionORAxLastIdx && definingRule === AxiomTypes.TYPE_OR_INTERACTION && (
						<div key={777 + "craft"} className="axiom-crafter-container">
							<AxiomCrafter
								config={props.config}
								objects={objectList}
								handleAxiomCreation={handleAxiomCreation}
								ruleType={ruleType}
							></AxiomCrafter>
						</div>
					)}

					{/* ------------------Temporal Axioms---------------- */}
					<hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
					<div style={{ display: "flex", width: "100%", alignContent: "center", height: "30px" }}>
						<span className="sub-section-title" style={{ width: 115 }}>
							Temporal conditions
						</span>
						{currAxiomSetIdx === 0 && (
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
						)}
					</div>
					{temporalAxStartIdx && (
						<div className="temporal-axioms-container">
							{axioms.slice(temporalAxStartIdx).map((axiom, idx) => (
								<Axiom
									idx={idx + temporalAxStartIdx}
									key={idx + temporalAxStartIdx + 1}
									data={axiom}
									config={props.config}
									messageCallback={props.sendMessage}
									onWhyNotWhatQuery={props.onWhyNotWhatQuery}
									onWhyWhatQuery={props.onWhyWhatQuery}
									activityInstances={props.activityInstances}
									onWhyNotHover={props.onWhyNotHover}
									classificationResult={props.classificationResult}
									activity={props.activity}
									selectedInstancesIdx={props.selectedInstancesIdx}
									onWhyNotHowTo={props.onWhyNotHowTo}
									stats={props.whyNotWhat}
									whyQueryMode={props.whyQueryMode}
									onWhyHowToQuery={props.onWhyHowToQuery}
									onQuestionMenu={props.onQuestionMenu}
									queryTrigger={props.queryTrigger}
									active={currAxiomSetIdx === 0}
								></Axiom>
							))}
						</div>
					)}
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

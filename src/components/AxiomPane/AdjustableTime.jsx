import "./AdjustableTime.css";

import AxiomTypes from "../../model/AxiomTypes";

function AdjustableTime(props) {
	let th = props.data.getTh2();
	if (props.title === "more than") {
		th = props.data.getTh1();
	} else if (props.title === "less than") {
		th = props.data.getTh2();
	}
	let active0 = true;
	if (th === -1) {
		active0 = false;
	}

	if (!active0) {
		th = props.title === "more than" ? AxiomTypes.VALUE_DEFAULT_TH1 : AxiomTypes.VALUE_DEFAULT_TH2;
	}

	let time = null;
	if (props.title === "more than") {
		time = props.data.getTh1();
	} else if (props.title === "less than") {
		time = props.data.getTh2();
	}

	return (
		<div className="time-distance-container">
			<div className="time-distance-adjust">
				<input
					id="sec"
					type="number"
					min={0}
					value={time === null ? "-----" : time + ""}
					onChange={(event) => {
						if (props.active) {
							props.messageCallback(AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED, {
								id: props.idx,
								time: parseInt(event.target.value),
								type: props.title,
							});
						}
					}}
					onMouseUp={(ev) => {
						if (props.active) {
							props.messageCallback(AxiomTypes.MSG_TIME_CONSTRAINT_FINALIZED, {});
						}
					}}
					style={{ width: 45, textAlign: "center", cursor: "default", fontSize: 10, color: "#605f5f" }}
				/>
			</div>
		</div>
	);
}

export default AdjustableTime;

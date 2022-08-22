import "./ActivityPane.css";

import AxiomTypes from "../../model/AxiomTypes";
import ActivtiyItem from "./ActivityItem";
import ActivityListColors from "./ActivityListColors";

import DatasetPane from "../DatasetPane/DatasetPane";
import { restartServer } from "../../APICalls/activityAPICalls";

function ActivityPane(props) {
	const { currentDataset, onDatasetChange, datasets } = props;

	return (
		<div style={{ display: "flex", flexDirection: "column", rowGap: 20, height: "100%" }}>
			<div className="activity-pane-container">
				<span className="section-title" id="title">
					Registered activities
				</span>
				<div className="activities-container">
					<ul>
						{props.activities.map((activity, idx) => {
							return (
								<ActivtiyItem
									key={idx}
									idx={idx}
									currentActivityIdx={props.currentActivityIdx}
									onActivitiyListChange={props.onActivitiyListChange}
									activity={activity}
									itemColor={ActivityListColors.getColor(idx)}
								></ActivtiyItem>
							);
						})}
					</ul>
				</div>
				<button
					className="add-btn"
					onClick={(ev) => {
						if (ev.shiftKey && ev.ctrlKey) {
                            restartServer();
						} else {
							props.onActivitiyListChange(AxiomTypes.MSG_ADD_ACTIVITY, null);
						}
					}}
				>
					+
				</button>
			</div>
			<div id="dataset-pane">
				<DatasetPane
					datasets={datasets}
					onDatasetChange={onDatasetChange}
					currentDataset={currentDataset}
				></DatasetPane>
			</div>
		</div>
	);
}

export default ActivityPane;

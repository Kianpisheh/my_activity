import "./DatasetPane.css";

function DatasetPane(props) {
	const { datasets, onDatasetChange, currentDataset } = props;

	return (
		<div id="dataset-pane-container">
			<span className="section-title" id="dataset-list-title">
				Datasets
			</span>
			<div id="list-container">
				{datasets.map((d) => {
					let style = {};
					if (d === currentDataset) {
						style = { background: "#E3DDCA" };
					}
					return (
						<div
							key={d}
							id="dataset-list-item"
							className="list-item"
							style={style}
							onClick={() => onDatasetChange(d)}
						>
							{d}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default DatasetPane;

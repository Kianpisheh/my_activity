import "./EventStatExplanation.css"

import Activity from "../../model/Activity";
import EventStat from "../../model/EventStat";

function EventStatExplanation(props) {
	const { stats, instances } = props;

	let activities = Activity.getActivityList(instances);
	let statPerActivity = {};
    let avgDurations = 0;
    let avgOccurances = 0;
    let coverageNums = 0;
    avgDurations = EventStat.getAvgDuration(stats);
	avgOccurances = EventStat.getAvgNumOccurrances(stats);
	coverageNums = EventStat.getCoverageNums(stats);
	statPerActivity["All"] = { avgDurations: avgDurations, avgOccurances: avgOccurances, coverageNums: coverageNums };
	for (const act of activities) {
		avgDurations = EventStat.getAvgDuration(stats, act);
		avgOccurances = EventStat.getAvgNumOccurrances(stats, act);
		coverageNums = EventStat.getCoverageNums(stats, act);
		statPerActivity[act] = { avgDurations: avgDurations, avgOccurances: avgOccurances, coverageNums: coverageNums };
	}

    return <div className="stats-container">
        {Object.keys(statPerActivity).map((act => {
            return (act !== "") && parseInt(statPerActivity[act].coverageNums) !==0 && <div className="single-stat-container">
                <span className="stat-activity-title">{act}</span>
                <div className="stats">
                    <div style={{display: "flex", alignItems: "flex-end", columnGap: 10}}>
                        <span className="stat-element">{statPerActivity[act].coverageNums}</span>
                        <span style={{fontSize: 14}}>{" "}times</span>
                    </div>
                    <div style={{display: "flex", alignItems: "flex-end", columnGap: 10}}>
                        <span className="stat-element">{Math.round(10*parseFloat(statPerActivity[act].avgOccurances))/10}</span>
                        <span style={{fontSize: 14}}>{" "}times on average</span>
                    </div>
                    <div style={{display: "flex", alignItems: "flex-end", columnGap: 10}}>
                        <span className="stat-element">{Math.round(10*parseFloat(statPerActivity[act].avgDurations))/10}</span>
                        <span style={{fontSize: 14}}>{" "} sec on average</span>
                    </div>
                </div>
            </div>
        }))}
        
    </div>
}

export default EventStatExplanation;

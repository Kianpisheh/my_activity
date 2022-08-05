import SystemStatus from "./SystemStatus";

class QuestionMaker {
	static getQuestions(sysStatus: string, data: any) {
		let questions = [];

        if (sysStatus === SystemStatus.FN_SELECTED) {
            const selectedIdx = data["selected_idx"];
            const activity =  data["current_activity"];
            
        }
	}
}

export default QuestionMaker;


function getFNQuestion(selectedIdx: number[], activity: string) {
    let oo = <QuestionPanel>
}
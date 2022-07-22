class RuleitemExplainer {
    static getSuppExplanation(supp, activity, N, itemNum) {
        let pronoun = "This event";
        if (itemNum > 1) {
            pronoun = "These events";
        }
        return (
            <span style={{ width: "80%", textAlign: "left", fontSize: 13 }}>
                {pronoun} has appearred{" "}
                <span style={{ fontWeight: "bold" }}>{supp}</span> times in the
                group of activities that are labeled as{" "}
                <span style={{ color: "#2F4BB0", fontWeight: "bold" }}>
                    {activity + " "}
                </span>
                ({N} in total).
            </span>
        );
    }

    static getConfExplanation(conf, supp, activity, itemNum) {
        let pronoun = "This event";
        if (itemNum > 1) {
            pronoun = "These events";
        }
        return (
            <span style={{ width: "80%", textAlign: "left", fontSize: 13 }}>
                {pronoun} has appearred{" "}
                <span style={{ fontWeight: "bold" }}>
                    {Math.round(supp / conf)}
                </span>{" "}
                times in all activities in the dataset from which {" "}
                <span style={{ fontWeight: "bold" }}>
                    {Math.round(supp) + " "}
                </span>
                are labeled as
                <span style={{ color: "#2F4BB0", fontWeight: "bold" }}>
                    {" " + activity}
                </span>
                .
            </span>
        );
    }
}

export default RuleitemExplainer;

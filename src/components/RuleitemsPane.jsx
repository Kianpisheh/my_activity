import "./RuleitemsPane.css";

import Icons from "../icons/Icons";

import RuleitemsExplainer from "./RuleitemsExplainer";
import { pascalCase } from "../Utils/utils";

function RuleitemsPane(props) {
    const { currentActivityInstance, ruleitems } = props;

    if (Object.keys(ruleitems).length === 0 || !currentActivityInstance) {
        return;
    }

    let actRuleitems = ruleitems[currentActivityInstance.getType()];
    let items;

    let N = 0;
    if (props.classificationResult) {
        N = props.classificationResult["N"];
    }

    items = (
        <ul>
            {actRuleitems.map((rule, idx) => {
                if ((rule["supp"] / N) < 0.75) {
                    return;
                }
                return (
                    <li key={idx}>
                        <div
                            key={idx + "ruleitem-div"}
                            className="ruleitem-div"
                        >
                            <div
                                key={idx + "item-icons-div"}
                                className="item-icons-div"
                            >
                                {rule["items"].map((item, idx2) => {
                                    const Icon = Icons.getIcon(
                                        pascalCase(item)
                                    );
                                    let iconComp = <span>{item}</span>;
                                    if (Icon) {
                                        iconComp = (
                                            <Icon
                                                key={idx2}
                                                pointerEvents={"bounding-box"}
                                                width={30}
                                                height={30}
                                            ></Icon>
                                        );
                                    }
                                    return iconComp;
                                })}
                            </div>
                            <div className="all-exp-div">
                                <div className="rule-suppconf-exp">
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color: "#2F4BB0",
                                            fontSize: 24,
                                        }}
                                    >
                                        Coverage: {rule["supp"] + " / " + N}
                                    </span>
                                    {RuleitemsExplainer.getSuppExplanation(
                                        rule["supp"],
                                        rule["activity"],
                                        N,
                                        rule["items"]?.length
                                    )}
                                </div>
                                <div className="rule-suppconf-exp">
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color: "#2F4BB0",
                                            fontSize: 24,
                                        }}
                                    >
                                        Accuracy: {rule["supp"] +
                                            " / " +
                                            Math.round(
                                                rule["supp"] / rule["conf"]
                                            )}
                                    </span>
                                    {RuleitemsExplainer.getConfExplanation(
                                        rule["conf"],
                                        rule["supp"],
                                        rule["activity"],
                                        rule["items"]?.length
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );

    return <div className="main-div">{items}</div>;
}

export default RuleitemsPane;

export interface IRuleitem {
    items: string[];
    conf: number;
    supp: number;
}

class RuleitemData {
    items: string[];
    conf: number;
    supp: number;
    activity: string;

    constructor(activity: string, items: string[], conf: number, supp: number) {
        this.activity = activity;
        this.items = items;
        this.conf = conf;
        this.supp = supp;
    }

    getItems() {
        return this.items;
    }

    getConf() {
        return this.conf;
    }

    getSupp() {
        return this.supp;
    }

    setItems(items: string[]) {
        this.items = items;
    }

    setConf(conf: number) {
        this.conf = conf;
    }

    setSupp(supp: number) {
        this.supp = supp;
    }

    static getitems(rules: { [act: string]: IRuleitem[] }) {
        let ruleitems: { [activity: string]: RuleitemData[] } = {};

        let ruleObjs = Object.entries(rules);
        for (let i = 0; i < ruleObjs.length; i++) {
            let activity = ruleObjs[i][0];
            let rItemsObj = ruleObjs[i][1];
            let rItems: RuleitemData[] = [];
            for (let j = 0; j < rItemsObj.length; j++) {
                rItems.push(new RuleitemData(activity, rItemsObj[j]["items"], rItemsObj[j]["conf"], rItemsObj[j]["supp"]))
            }
            ruleitems[activity] = rItems;
        }
        return ruleitems;
    }
}


export default RuleitemData;
import mug from "../images/action_events/mug.svg";
import pitcher from "../images/action_events/pitcher.svg";
import stove from "../images/action_events/stove.svg";
import water_bottle from "../images/action_events/water_bottle.svg";
import stovetop from "../images/action_events/stovetop.svg";
import stove_lighter from "../images/action_events/stove_lighter.svg";
import tooth_brush from "../images/action_events/tooth_brush.svg";
import water_faucet from "../images/action_events/water_faucet.svg";
import kettle from "../images/action_events/kettle.svg";
import coffee_machine from "../images/action_events/coffee_machine.svg";
import time_distance from "../images/time_distance.svg";
import increase_sec from "../images/increase_sec.svg";
import decrease_sec from "../images/decrease_sec.svg";
import add_activity_btn from "../images/add_activity_btn.svg";
import zoom_in from '../images/zoom_in.svg'
import zoom_out from '../images/zoom_out.svg'


class EventIcons {
    static icons = {
        Mug: mug,
        Pitcher: pitcher,
        Stove: stove,
        WaterBottle: water_bottle,
        StoveTop: stovetop,
        StoveLighter: stove_lighter,
        ToothBrush: tooth_brush,
        Kettle: kettle,
        CoffeeMachine: coffee_machine,
        WaterFaucet: water_faucet,
        time_distance: time_distance,
        increase_sec: increase_sec,
        decrease_sec: decrease_sec,
        add_activity_btn: add_activity_btn,
        zoom_in: zoom_in,
        zoom_out: zoom_out
    };

    static colors = {
        Mug: "#003f5c",
        Pitcher: "#2f4b7c",
        Stove: "#f95d6a",
        WaterBottle: "#3ca9ae",
        StoveTop: "#a55221",
        StoveLighter: "#f95d6a",
        ToothBrush: "#d45087",
        CoffeeMachine: "#233599"
    }

    static getIcons() {
        return this.icons;
    }

    static get(key) {
        // convert into lower case with underscore if it is not
        // let key2 = key.replace('_', '');
        // let new_key = key;
        // let keyUpperCase = key2.toUpperCase();
        // for (let i = 1; i < key2.length; i++) {
        //     if (key2[i] === keyUpperCase[i]) {
        //         new_key = (key2.slice(0, i)).toLowerCase() + "_" + (key2.slice(i, key2.length)).toLowerCase();
        //         return this.icons[new_key];
        //     }
        // }
        return this.icons[key];
    }

    static getColor(key) {
        if (this.colors[key]) {
            console.log("key: ", this.colors[key])
            return this.colors[key];
        } else {
            return "#a55221";
        }
    }

    static getKey(key) {
        let key2 = key.replace('_', '');
        let new_key = key;
        let keyUpperCase = key2.toUpperCase();
        for (let i = 1; i < key2.length; i++) {
            if (key2[i] === keyUpperCase[i]) {
                new_key = (key2.slice(0, i)).toLowerCase() + "_" + (key2.slice(i, key2.length)).toLowerCase();
                return new_key;
            }
        }
        return key;
    }

}

export default EventIcons;

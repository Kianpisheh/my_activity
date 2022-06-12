import mug from "../images/action_events/mug.svg";
import pitcher from "../images/action_events/pitcher.svg";
import stove from "../images/action_events/stove.svg";
import water_bottle from "../images/action_events/water_bottle.svg";
import stovetop from "../images/action_events/stovetop.svg";
import stove_lighter from "../images/action_events/stove_lighter.svg";
import tooth_brush from "../images/action_events/tooth_brush.svg";
import water_faucet from "../images/action_events/water_faucet.svg";
import scissors from "../images/action_events/scissors.svg";
import kettle from "../images/action_events/kettle.svg";
import tap from "../images/action_events/tap.svg";
import bottle from "../images/action_events/bottle.svg";
import door from "../images/action_events/door.svg";
import glass from "../images/action_events/glass.svg";
import soap from "../images/action_events/soap.svg";
import sponge from "../images/action_events/sponge.svg";
import straw from "../images/action_events/straw.svg";
import potato_peeler from "../images/action_events/potato_peeler.svg";
import bowl from "../images/action_events/bowl.svg";
import container from "../images/action_events/container.svg";
import knife from "../images/action_events/knife.svg";
import drawer from "../images/action_events/drawer.svg";
import fruit_juice from "../images/action_events/fruit_juice.svg";
import cutlery from "../images/action_events/cutlery.svg";
import coffee_machine from "../images/action_events/coffee_machine.svg";
import time_distance from "../images/time_distance.svg";
import tupperware from "../images/action_events/tupperware.svg";
import coffee_pot from "../images/action_events/coffee_pot.svg";
import peach from "../images/action_events/peach.svg";
import fridge from "../images/action_events/fridge.svg";
import plate from "../images/action_events/plate.svg";
import banana from "../images/action_events/banana.svg";
import jar from "../images/action_events/jar.svg";

import increase_sec from "../images/increase_sec.svg";
import decrease_sec from "../images/decrease_sec.svg";
import add_activity_btn from "../images/add_activity_btn.svg";
import zoom_in from '../images/zoom_in.svg'
import zoom_out from '../images/zoom_out.svg'


class EventIcons {

    static icons: { [name: string]: object } = {
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
        PotatoPeeler: potato_peeler,
        Tap: tap,
        Scissors: scissors,
        Fridge: fridge,
        Cutlery: cutlery,
        Knife: knife,
        Soap: soap,
        Straw: straw,
        Sponge: sponge,
        Bowl: bowl,
        Tupperware: tupperware,
        Jar: jar,
        Plate: plate,
        Dish: plate,
        Banana: banana,
        Container: container,
        Door: door,
        Drawer: drawer,
        FruitJuice: fruit_juice,
        Glass: glass,
        Bottle: bottle,
        Carafe: coffee_pot,
        Peach: peach,
        TimeDistance: time_distance,
        IncreaseSec: increase_sec,
        DecreaseSec: decrease_sec,
        AddActivitybtn: add_activity_btn,
        ZoomIn: zoom_in,
        ZoomOut: zoom_out
    };

    static colors: { [name: string]: string } = {
        Mug: "#003f5c",
        Pitcher: "#2f4b7c",
        Stove: "#f95d6a",
        WaterBottle: "#3ca9ae",
        StoveTop: "#a55221",
        StoveLighter: "#f95d6a",
        ToothBrush: "#d45087",
        CoffeeMachine: "#233599",
        PotatoPeeler: "#483D8B",
        Tap: "#483D8B",
        Scissors: "#FF4500",
        Cutlery: "#DC143C",
        Knife: "#4B0082",
        Soap: "#8B4513",
        Straw: "#2F4F4F",
        Sponge: "#1E90FF",
        Bowl: "#FF00FF",
        Container: "##3CB371",
        Door: "#DB7093",
        Drawer: "#9ACD32",
        FruitJuice: "#008080",
        Glass: "#556B2F",
        Bottle: "#BDB76B",
        Tupperware: "#1e90ff",
        CoffeePot: "#800000",
        Peach: "#faa500",
        Fridge: "#800080",
        Plate: "#1E9A4B",
        Jar: "#2967EC",
        Banana: "#E0EC29",
        Carafe: "#341679"
    }

    static getIcons() {
        return this.icons;
    }

    static get(key: string) {
        let newKey: string = key;
        if (key.includes("_")) {
            let keyParts: string[] = key.split("_");
            newKey = (keyParts?.[0]?.charAt(0)?.toUpperCase() ?? "") + keyParts?.[0]?.slice(1) + keyParts?.[1]?.charAt(0).toUpperCase() + keyParts?.[1]?.slice(1);
        } else {
            newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1)
        }

        return this.icons[newKey];
    }

    static getColor(key: string) {
        if (this.colors[this.getKey(key)]) {
            return this.colors[this.getKey(key)];
        } else {
            return "#a55221";
        }
    }

    static getKey(key: string) {
        let newKey: string = key;
        if (key.includes("_")) {
            let keyParts: string[] = key.split("_");
            newKey = (keyParts?.[0]?.charAt(0)?.toUpperCase() ?? "") + keyParts?.[0]?.slice(1) + keyParts?.[1]?.charAt(0).toUpperCase() + keyParts?.[1]?.slice(1);
        } else {
            newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1)
        }
        return newKey;
    }
}

export default EventIcons;

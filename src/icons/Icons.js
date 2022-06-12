import SvgBottle from "./Bottle";
import SvgBanana from "./Banana";
import SvgBowl from "./Bowl";
import SvgCoffeeMachine from "./CoffeeMachine";
import SvgCoffeePot from "./CoffeePot";
import SvgContainer from "./Container";
import SvgCutlery from "./Cutlery";
import SvgDrawer from "./Drawer";
import SvgFridge from "./Fridge";
import SvgFruitJuice from "./FruitJuice";
import SvgGlass from "./Glass";
import SvgJar from "./Jar";
import SvgKettle from "./Kettle";
import SvgKnife from "./Knife";
import SvgMug from "./Mug";
import SvgPeach from "./Peach";
import SvgPitcher from "./Pitcher";
import SvgPlate from "./Plate";
import SvgPotatoPeeler from "./PotatoPeeler";
import SvgScissors from "./Scissors";
import SvgSoap from "./Soap";
import SvgSponge from "./Sponge";
import SvgStove from "./Stove";
import SvgStoveLighter from "./StoveLighter";
import SvgStraw from "./Straw";
import SvgTap from "./Tap";
import SvgToothBrush from "./ToothBrush";
import SvgTupperware from "./Tupperware";
import SvgWaterBottle from "./WaterBottle";
import SvgWaterFaucet from "./WaterFaucet";
import SvgStovetop from "./Stovetop";
import SvgNotFound from "./NotFound";

class Icons {

    static icons = {
        Mug: SvgMug,
        Pitcher: SvgPitcher,
        Stove: SvgStove,
        WaterBottle: SvgWaterBottle,
        StoveTop: SvgStovetop,
        StoveLighter: SvgStoveLighter,
        ToothBrush: SvgToothBrush,
        Kettle: SvgKettle,
        CoffeeMachine: SvgCoffeeMachine,
        WaterFaucet: SvgWaterFaucet,
        PotatoPeeler: SvgPotatoPeeler,
        Tap: SvgTap,
        Scissors: SvgScissors,
        Fridge: SvgFridge,
        Cutlery: SvgCutlery,
        Knife: SvgKnife,
        Soap: SvgSoap,
        Straw: SvgStraw,
        Sponge: SvgSponge,
        Bowl: SvgBowl,
        Tupperware: SvgTupperware,
        Jar: SvgJar,
        Plate: SvgPlate,
        Dish: SvgPlate,
        Banana: SvgBanana,
        Container: SvgContainer,
        Door: "",
        Drawer: SvgDrawer,
        FruitJuice: SvgFruitJuice,
        Glass: SvgGlass,
        Bottle: SvgBottle,
        Carafe: SvgCoffeePot,
        Peach: SvgPeach,
        NotFound: SvgNotFound
    }

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

    static getIcon(key) {
        if (this.icons[key]) {
            return this.icons[key];
        } else {
            return this.icons["NotFound"];
        }
    }

    static getColor(key) {
        if (this.colors[key]) {
            return this.colors[key];
        } else {
            return "#BAB8BD";
        }
    }
}

export default Icons;

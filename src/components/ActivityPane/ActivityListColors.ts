

class ActivityListColors {

    static colors: string[] = ["#2261C8", "#B315C6", "#929410", "#3fab92", "#2d565c", "#F47D3A", "#CBC506", "#1E06CB", "#0DDE17"];


    static getColor(idx: number): string {
        return this.colors[idx];
    }
}

export default ActivityListColors;
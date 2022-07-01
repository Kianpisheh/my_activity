

class ActivityListColors {

    static colors: string[] = ["#2261C8", "#B315C6", "#36A45F", "#CD335D", "#59B5CA", "#F47D3A", "#CBC506", "#1E06CB", "#0DDE17"];


    static getColor(idx: number): string {
        return this.colors[idx];
    }
}

export default ActivityListColors;
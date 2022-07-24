class AxiomStat {
    minTimeDistance: number;
    maxTimeDistance: number;
    minDuration1: number;
    maxDuration1: number;
    minDuration2: number;
    maxDuration2: number;
    events: string[]

    constructor(events: string[]) {
        this.events = events;
    }

    setMinTimeDistance(td: number) {
        this.minTimeDistance = td;
    }

    setMaxTimeDistance(td: number) {
        this.maxTimeDistance = td;
    }

    setMinDuration1(d: number) {
        this.minDuration1 = d;
    }

    setMinDuration2(d: number) {
        this.minDuration2 = d;
    }

    setMaxDuration1(d: number) {
        this.maxDuration1 = d;
    }

    setMaxDuration2(d: number) {
        this.maxDuration2 = d;
    }

    updateTimeDistance(td: number) {
        if (!this.maxTimeDistance) {
            this.maxTimeDistance = td;
        } else if (td > this.maxTimeDistance) {
            this.maxTimeDistance = td;
        }

        if (!this.minTimeDistance) {
            this.minTimeDistance = td;
        } else if (td < this.minTimeDistance) {
            this.minTimeDistance = td;
        }

    }

    updateEventDuration(d: number, event: string) {
        if (event === this.events[0]) {
            if (!this.maxDuration1) {
                this.maxDuration1 = d;
            } else if (d > this.maxDuration1) {
                this.maxDuration1 = d;
            }
    
            if (!this.minDuration1) {
                this.minDuration1 = d;
            } else if (d < this.minDuration1) {
                this.minDuration1 = d;
            }
        } else if (event === this.events[1]) {
            if (!this.maxDuration2) {
                this.maxDuration2 = d;
            } else if (d > this.maxDuration2) {
                this.maxDuration2 = d;
            }
    
            if (!this.minDuration2) {
                this.minDuration2 = d;
            } else if (d < this.minDuration2) {
                this.minDuration2 = d;
            }
        }
    }

    merge(other: AxiomStat): AxiomStat {
        if (other.events !== this.events) {
            return null;
        }

        let outputAxStat = new AxiomStat(this.events);
        outputAxStat.maxTimeDistance = Math.max(this.maxTimeDistance, other.maxTimeDistance);
        outputAxStat.minTimeDistance = Math.min(this.minTimeDistance, other.minTimeDistance);
        outputAxStat.minDuration1 = Math.min(this.minDuration1, other.minDuration1);
        outputAxStat.maxDuration1 = Math.max(this.maxDuration1, other.maxDuration1);
        outputAxStat.minDuration2 = Math.min(this.minDuration2, other.minDuration2);
        outputAxStat.maxDuration2 = Math.max(this.maxDuration2, other.maxDuration2);

        return outputAxStat;
    }

}

export default AxiomStat;
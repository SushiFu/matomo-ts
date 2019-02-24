import { IEvent } from './IEvent';

export default class Variation {
    private name: string;
    private percentage: number;
    private activate: (this: Variation, event: IEvent) => void;

    public constructor(name: string) {
        this.name = name;
        this.activate = () => null;
    }

    public setPercentage(percentage: number): Variation {
        this.percentage = percentage;
        return this;
    }

    public setActivate(activate: (this: Variation, event: IEvent) => void): Variation {
        this.activate = activate;
        return this;
    }
}

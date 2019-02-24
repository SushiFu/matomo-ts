import Matomo from '..';
import { IEvent } from './IEvent';
import Variation from './Variation';

export default class ABTest {
    private name: string;
    private includedTargets: [{ [k: string]: string }?] = [];
    private excludedTargets: [{ [k: string]: string }?] = [];
    private percentage: number = 100;
    private startDateTime?: string;
    private endDateTime?: string;
    private trigger?: (event: IEvent) => boolean;
    private variations: Variation[] = [];

    public constructor(name: string) {
        this.name = name;
    }

    public setPercentage(percentage: number): ABTest {
        this.percentage = percentage;
        return this;
    }

    public setStartTime(startDateTime: string): ABTest {
        this.startDateTime = startDateTime;
        return this;
    }

    public setEndTime(endDateTime: string): ABTest {
        this.endDateTime = endDateTime;
        return this;
    }

    public setTrigger(trigger: () => boolean): ABTest {
        this.trigger = trigger;
        return this;
    }

    public addIncludedTarget(includedTarget: { [k: string]: string }): ABTest {
        this.includedTargets.push(includedTarget);
        return this;
    }

    public addExludedTarget(excludedTarget: { [k: string]: string }): ABTest {
        this.excludedTargets.push(excludedTarget);
        return this;
    }

    public addVariation(variation: Variation): ABTest {
        this.variations.push(variation);
        return this;
    }

    public start(matomo: Matomo): void {
        if (this.variations.length < 1) {
            throw new Error('There is no variation ');
        }
        matomo.push(['AbTesting::create', this]);
    }
}

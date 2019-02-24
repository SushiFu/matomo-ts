import ABTest from './ABTest';

export interface IEvent {
    experiment: ABTest;
    redirect: (url: string) => void;
    onReady: (callback: () => void) => void;
}

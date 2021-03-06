import { LocationState, Path, LocationDescriptorObject, Action, Location } from 'history';
import { CallHistoryMethodAction } from 'connected-react-router';

type ValuesOf<T extends Array<any>>= T[number];

export type RouterState<T extends string> = {
    [P in ValuesOf<Array<T>>]: LocationState & { location: Location<{ from: Location }>, action: Action }
}

export type RouterDispatch<T extends string> = {
    [P in ValuesOf<Array<T>>]: {
        push<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        push<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        replace<S = LocationState>(path: Path, state?: S): CallHistoryMethodAction<[ Path, S? ]>;
        replace<S = LocationState>(location: LocationDescriptorObject<S>): CallHistoryMethodAction<[ LocationDescriptorObject<S> ]>;
        go(n: number): CallHistoryMethodAction<[ number ]>;
        goBack(): CallHistoryMethodAction<[]>;
        goForward(): CallHistoryMethodAction<[]>;
    }
}
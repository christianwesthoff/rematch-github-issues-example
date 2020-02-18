import * as React from 'react';

/**
 * Creates a flipflop variable on a certain value change.
 */
const useWatcher = <T>(value: T, expectedValue: T): boolean => {
    const [state, setState] = React.useState(false);
    const previous = React.useRef(value);
    React.useEffect(() => {
        if ((!previous || previous.current !== value) && value === expectedValue) {
            setState(state => !state);
        }
      }, [expectedValue, value]);
    return state;
}

export default useWatcher;
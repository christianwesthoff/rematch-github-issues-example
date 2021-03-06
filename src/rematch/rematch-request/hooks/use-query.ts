import React from 'react';
import { useDispatch } from 'react-redux';
import { queryAsync, cancelQuery } from '../actions';
import { getQueryKey } from '../lib/keys';
import { QueryConfig, RequestKey, ExtractStateFromQueryConfig } from '../types';

import useConstCallback from './use-const-callback';
import useMemoizedQueryConfig from './use-memoized-query-config';
import useQueryState from './use-query-state';

import { QueryState } from '../types';
import { reselectEntityStateFromQueryState } from '../lib/reselect';

const useQuery = <TQueryConfig extends QueryConfig>(
  providedQueryConfig?: TQueryConfig | undefined,
): [QueryState, () => void, (state: any) => ExtractStateFromQueryConfig<TQueryConfig>] => {
  const reduxDispatch = useDispatch();

  // This hook manually tracks the pending state, which is synchronized as precisely as possible
  // with the Redux state. This may seem a little hacky, but we're trying to avoid any asynchronous
  // synchronization. Hence why the pending state here is using a ref and it is updated via a
  // synchronous callback, which is called from the redux-query query middleware.
  const isPendingRef = React.useRef(false);

  // These "const callbacks" are memoized across re-renders. Unlike useCallback, useConstCallback
  // guarantees memoization, which is relied upon elsewhere in this hook to explicitly control when
  // certain side effects occur.
  const finishedCallback = useConstCallback(() => {
    isPendingRef.current = false;
  });

  // Setting `retry` to `true` for these query configs makes it so that when this query config is
  // passed to a requestAsync action, if a previous request with the same query key failed, it will
  // retry the request (if `retry` is `false`, then it would essentially ignore the action).
  const transformQueryConfig = useConstCallback(
    (queryConfig?: QueryConfig | undefined): QueryConfig | undefined => {
        if (queryConfig) {
            return {
                ...queryConfig,
                preDispatchCallback: finishedCallback,
                retry: true,
              };
        }
        return undefined;
    },
  );

  // Query configs are memoized based on query key. As long as the query key doesn't change, the
  // query config won't change.
  const queryConfig = useMemoizedQueryConfig(providedQueryConfig, transformQueryConfig);


  // const isInvalid = queryState ? queryState.isInvalid : false
  const dispatchRequestToRedux = useConstCallback((queryConfig: QueryConfig) => {
    const promise = reduxDispatch(queryAsync(queryConfig));

    // If a promise is not returned, we know that the query middleware ignored this request and
    // one will not be made, so don't consider it as "pending".
    if (promise) {
      isPendingRef.current = true;
    }

    return promise;
  });

  const dispatchCancelToRedux = useConstCallback((requestKey: RequestKey) => {
    reduxDispatch(cancelQuery(requestKey));
    isPendingRef.current = false;
  });

  const refresh = React.useCallback(() => {
    if (queryConfig) {
      return dispatchRequestToRedux({
        ...queryConfig,
        force: true,
      });
    }
  }, [dispatchRequestToRedux, queryConfig]);

  // This is an object that contains metadata about the query, like things from querySelectors
  // (e.g.`isPending`, `requestCount`, etc.)
  const queryState = useQueryState(queryConfig);

  // The invalid count of the query is used to determine if a change should be triggered
  const { invalidCount, maps } = queryState

  React.useEffect(() => {
    // Dispatch `queryAsync` actions whenever the query config (note: memoized based on query
    // key) changes.
    if (queryConfig) {
      dispatchRequestToRedux(queryConfig);
    }

    return () => {
      // If there is an pending request whenever the component unmounts of the query config
      // changes, cancel the pending request.
      if (isPendingRef.current) {
        const requestKey = getQueryKey(queryConfig);

        if (requestKey) {
          dispatchCancelToRedux(requestKey);
        }
      }
    };
  
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfig, invalidCount]);

  const reselect = reselectEntityStateFromQueryState<any, ExtractStateFromQueryConfig<TQueryConfig>>(maps);
  return [queryState, refresh, reselect];
};

export default useQuery;
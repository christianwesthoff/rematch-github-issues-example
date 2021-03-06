import { NetworkInterface, RequestHeaders, ReduxApi } from './types';
import HttpMethods, { HttpMethod } from './constants/http-methods';
import axios, { AxiosInstance, CancelToken } from 'axios';

const getCancelToken = () => {
  var source = axios.CancelToken.source();
  return { token: source.token, cancel: source.cancel }
};

const getRequest = (instance: AxiosInstance, url: string, method: HttpMethod, body: any) => {
    switch (method) {
      case HttpMethods.HEAD:
        return instance.head(url, body);
      case HttpMethods.GET:
        return instance.get(url, body);
      case HttpMethods.POST:
        return instance.post(url, body);
      case HttpMethods.PUT:
        return instance.put(url, body);
      case HttpMethods.PATCH:
        return instance.patch(url, body);
      case HttpMethods.DELETE:
        return instance.delete(url, body);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  };

const getInstance = (headers?: RequestHeaders, withCredentials?: boolean, cancelToken?: CancelToken, baseUrl?: string): AxiosInstance => axios.create({
    baseURL: baseUrl,
    withCredentials,
    headers,
    cancelToken
});

const axiosInterface = (configure?: ((instance:AxiosInstance, reduxApi?: ReduxApi<any, any>) => AxiosInstance) | undefined): NetworkInterface => (
    url,
    method,
    { body, headers, credentials } = {},
    reduxApi,
) => {

    const { token, cancel } = getCancelToken();
    const instance = getInstance(headers, credentials === 'include', token);
    const configured = configure ? configure(instance, reduxApi) : instance;
    const request = getRequest(configured, url, method, body);

    const execute = (cb: any) =>
      request.then(function (response) {
          const resStatus = (response && response.status) || 0;
          const resBody = (response && response.data) || undefined;
          const resHeaders = (response && response.headers) || undefined;
          cb(undefined, resStatus, resBody, resHeaders);
        })
        .catch(function (error) {
          if (error.response) {
            cb(error, error.response.status, error.response.data, error.response.headers);
          } else {
            cb(error);
          }
        });

    const abort = () => cancel();

    return {
      abort,
      execute,
    };
};

export default axiosInterface;
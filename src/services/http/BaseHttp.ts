import type { AxiosInstance, AxiosResponse } from "axios";
import http from "./http";
import type BaseInterfaceParamsQueryString from "./BaseInterfaceParamsQueryString";
import type InterfaceHttp from "./InterfaceHttp";
import type InterfaceResponseList from "./InterfaceResponseList";
export default abstract class BaseHttp<
  InterfaceList extends any = any,
  InterfaceStore extends any = any,
  InterfaceUpdate extends any = any,
  ParamnsQueryString extends BaseInterfaceParamsQueryString = BaseInterfaceParamsQueryString
> implements InterfaceHttp
{
  uri = "";
  id: number | string | undefined;
  http: AxiosInstance;
  constructor(id?: number | string) {
    this.id = id;
    this.initUri();
    this.http = http;
  }

  initUri() {
    this.uri = this.resource() + this.getId();
  }

  setUri(uri: string) {
    this.uri = uri;
  }

  getId() {
    return typeof this.id != "undefined" ? `/${this.id}` : "";
  }

  getUri() {
    return this.uri;
  }

  showPdf(
    params?: ParamnsQueryString
  ): Promise<AxiosResponse<InterfaceResponseList<InterfaceList>>> {
    return http.get(this.uri, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      params,
    });
  }

  list(
    params?: ParamnsQueryString
  ): Promise<AxiosResponse<InterfaceResponseList<InterfaceList>>> {
    return http.get(this.uri, { params });
  }

  find(params?: ParamnsQueryString): Promise<AxiosResponse<InterfaceList>> {
    if (this.id == undefined) {
      throw new Error("Id não informado, usar a função [list]");
    }

    return http.get<InterfaceList>(this.uri, { params });
  }

  store(
    data: InterfaceStore,
    config?: any
  ): Promise<AxiosResponse<InterfaceList>> {
    return http.post(this.uri, data, config);
  }

  update(data: InterfaceUpdate, config?: any): Promise<AxiosResponse<any>> {
    return http.put(this.uri, data, config);
  }

  patch(data: any, config?: any): Promise<AxiosResponse<any>> {
    return http.patch(this.uri, data, config);
  }

  delete(data?: any): Promise<AxiosResponse<any>> {
    return http.delete(this.uri, data);
  }

  relationships(
    relation: any,
    // @ts-ignore
    id?: string | number | undefined
  ): ReturnType<typeof relation> {
    this.uri += `${relation.getUri()}`;
    relation.setUri(this.uri);
    return relation;
  }

  children(children: string) {
    this.uri = this.resource() + `/${children}`;
    return this;
  }

  abstract resource(): string;
}

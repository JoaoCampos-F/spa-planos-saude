export default interface InterfaceResponseList<InterfaceList extends any> {
  data: InterfaceList[];
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
}

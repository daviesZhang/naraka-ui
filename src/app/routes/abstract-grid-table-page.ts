import {GridTableComponent, GridTableReadyEvent, Page, RequestData} from "ngx-grid-table";
import {JsonFormComponent} from "@shared/json-form/json-form.component";
import {ParamsTransform, QueryPage, QueryParams} from "@core/modal/query";
import {mergeQueryParams, transformQueryParams} from "@shared/utils/tools";
import {Observable} from "rxjs";

export abstract class AbstractGridTablePage{

  protected searchForm?: JsonFormComponent;

  protected gridTable?: GridTableComponent;

  protected transform: ParamsTransform = {};

  onGridReady(event: GridTableReadyEvent, jsonForm: JsonFormComponent) {
    this.gridTable = event.gridTable;
    this.searchForm = jsonForm;
  }

  /**
   * getData的帮助方法,转换查询参数
   * @param queryPage
   * @param transform
   * @param getData
   * @param queryParams
   */
  getDataUtils=<T>(queryPage:QueryPage,getData:RequestData<T, QueryPage>,queryParams?:QueryParams):Observable<Page<T>> => {
    if (queryParams) {
      mergeQueryParams(queryPage.query, queryParams);
    }
    if (this.searchForm) {
      mergeQueryParams(queryPage.query, transformQueryParams(this.searchForm.value, this.transform));
    }
    return getData(queryPage);

  }

}

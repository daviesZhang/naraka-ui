import {GridTableComponent, GridTableReadyEvent} from "ngx-grid-table";
import {JsonFormComponent} from "@shared/json-form/json-form.component";

export abstract class AbstractGridTablePage{

  protected jsonForm?: JsonFormComponent;

  protected gridTable?: GridTableComponent;



  onGridReady(event: GridTableReadyEvent, jsonForm: JsonFormComponent) {
    this.gridTable = event.gridTable;
    this.jsonForm = jsonForm;
  }
}

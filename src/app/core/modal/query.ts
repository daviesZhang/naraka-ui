export const QueryFieldTypeArray = ['STARTS_WITH', 'ENDS_WITH', 'CONTAINS', 'LIKE', 'LESSTHAN', 'LESSTHANEQUAL',
  'EQUALS', 'GREATERTHANEQUAL', 'GREATERTHANE', 'ORDER_DESC', 'ORDER_ASC'] as const;

export type QueryFieldType = typeof QueryFieldTypeArray[number];

export interface QueryField {
  type: QueryFieldType;
  filter?: any;
}


/**
 * 查询的字段参数
 */
export class QueryParams {
  [key: string]: QueryField | Array<QueryField|string|boolean|number>| string | number | boolean;
}

/**
 * 分页查询的参数
 */
export class QueryPage {
  query: QueryParams;
  current: number;
  size: number;
  [key: string]: unknown;

  constructor(current: number = 1, size: number = 10, query: QueryParams) {
    this.current = current;
    this.size = size;
    this.query = query;
  }
}

export class ParamsTransform {
  [key: string]: (value: unknown) => QueryField | Array<QueryField|string | number | boolean> | string | number | boolean;

}

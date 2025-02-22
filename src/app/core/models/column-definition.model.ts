export interface ColumnDefinition {
  id: number;
  field: string;
  displayName: string;
  sortable?: boolean;
  filter?: boolean;
  filterApiKey?: string;
  filterOptions?: any;
  filterOptionsSelected?: any;
  filterOptionsSelectedTemporary?: any;
  editable?: boolean;
  style?: string;
  hidden?: boolean;
  isText?: boolean;
  valueType?: string;
  headerType?: string;
}

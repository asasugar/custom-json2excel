export type TObject = { [x: string]: any };
export type TArray = TObject[];

export interface IElsExtend {
  name: string;
  colspan: number;
}

export interface IJson2ExcelParam<T> {
  data: T[];
  orderedKey?: string[];
  filters?: string[];
  title?: IElsExtend[];
  footer?: IElsExtend[];
  keyMap?: TObject;
  name?: string;
  type?: 'xls' | 'csv';
  onStart?: () => void;
  onSuccess?: () => void;
}

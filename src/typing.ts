export type TObject = { [x: string]: any };
export type TArray = TObject[];

export interface IElsExtend {
  name: string;
  colspan: number;
}

export interface IJson2ExcelParam {
  data: TArray;
  scope?: TObject;
  orderedKey?: string[];
  filters?: string[];
  title?: IElsExtend[];
  footer?: IElsExtend[];
  keyMap?: TObject;
  name?: string;
  type?: 'xls' | 'csv';
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (err?: any) => void;
}

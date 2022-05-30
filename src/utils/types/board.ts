export type IFileAttached = {
  filename: string;
  fileSize: number;
};

export type ITaskResp = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
  files: IFileAttached[];
};

export type ITasksResp = {
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
  id: string;
};

export type IColumn = {
  id: string;
  title: string;
  order: number;
  tasks: ITaskResp[];
};

export type IBoardFull = {
  id: string;
  title: string;
  columns: IColumn[];
};

export type IColumnsResp = {
  id: string;
  title: string;
  order: number;
};

export type IColumnBody = {
  title: string;
  order: number;
};

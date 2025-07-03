export interface FileItem {
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface GeneratedZip {
  id: string;
  name: string;
  url: string;
  originalFileName: string;
  size: number;
  createdAt: Date;
}
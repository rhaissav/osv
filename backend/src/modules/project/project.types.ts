export interface CreateProjectDTO {
  title: string;
  description?: string;
  structure: any;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  structure?: any;
}

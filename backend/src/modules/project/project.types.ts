
export type ProjectStatus = 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface CreateProjectDTO {
  title: string;
  description?: string;
  structure: any;
  status?: ProjectStatus;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  structure?: any;
  status?: ProjectStatus;
}

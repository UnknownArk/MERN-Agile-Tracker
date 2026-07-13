export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask {
  _id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
  project: string; // Refers to Project ID
  updatedAt?: Date;
}

export interface IProject {
  _id: string;
  name: string;
  description?: string;
}

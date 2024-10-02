export interface IUser{
    _id:string;
    name:string;
    email:string;
}
export interface IRegisterUser{
    name: string;
    email: string;
    password: string;
}
export interface ILogin{
    email: string;
    password: string;
}
export interface ITask{
    _id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    completed: boolean;
    priority: string;
    user: string;
}
export interface IUpdateTaskRes{
    task:ITask,
    prevStatus:string
    }
export interface ICreateTask{
    title?: string;
    description?: string;
    dueDate?: Date;
    status?: string;
    completed?: boolean;
}
export interface IUpdateTask{
    taskId:string;
    title?: string;
    description?: string;
    dueDate?: Date;
    status?: string;
    completed?: boolean;
}
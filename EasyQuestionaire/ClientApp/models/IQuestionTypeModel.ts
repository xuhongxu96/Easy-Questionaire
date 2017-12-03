export interface IQuestionTypeModel {
    [key: string]: any,
    id: number,
    name: string,
    createFormTSX: string,
    showFormTSX: string,
    compiledCreateForm: string,
    compiledShowForm: string,
    ownerIP: string,
    createdAt: Date,
    updatedAt: Date,
}
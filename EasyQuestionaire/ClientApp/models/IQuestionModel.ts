export interface IQuestionModel {
    [key: string]: any,
    id: number,
    questionaireId: number,
    typeId: number,
    order: number,
    content: string,
    createdAt: Date,
    updatedAt: Date,
}
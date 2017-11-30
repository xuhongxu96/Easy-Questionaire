export interface IQuestionaireModel {
    [key: string]: any,
    id: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    isEnabled: boolean,
    ownerIP: string
    createdAt: Date,
    updatedAt: Date,
}
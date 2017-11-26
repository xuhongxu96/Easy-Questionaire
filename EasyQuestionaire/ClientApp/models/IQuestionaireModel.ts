export interface IQuestionaireModel {
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
export interface IAnswerModel {
    [key: string]: any,
    id: number,
    content: string,
    sessionId: string,
    timeSpent: number,
    questionId: number,
    ownerIP: string,
    createdAt: Date,
    updatedAt: Date,
}
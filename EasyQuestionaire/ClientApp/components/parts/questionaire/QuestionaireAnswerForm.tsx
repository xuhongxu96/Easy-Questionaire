import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { IQuestionModel } from '../../../models/IQuestionModel';
import { IAnswerModel } from '../../../models/IAnswerModel';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { QuestionEditor } from '../../parts/questionaire/QuestionEditor';
import {
    DynamicQuestionTypeComponent,
    IShowQuestionTypeComponentProps,
} from '../questionType/DynamicQuestionTypeComponent'
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';

export interface IQuestionaireAnswerFormProps {
    questionaire: IQuestionaireModel,
    questions: IQuestionModel[],
}

export interface IQuestionaireAnswerFormState {
    answerList: IAnswerModel[],
    answerMap: Map<number, IAnswerModel>,
    errorText: string,
    isLoading: boolean,
    questionIndex: number,
}

export class QuestionaireAnswerForm extends HasFetchComponent<IQuestionaireAnswerFormProps, IQuestionaireAnswerFormState> {

    private _timer: number | null = null;
    private _timeSpentSecond: number = 0;

    constructor() {
        super();

        this._onSubmitAnswer = this._onSubmitAnswer.bind(this);
        this._timeSpent = this._timeSpent.bind(this);

        this.state = {
            answerList: [],
            answerMap: new Map(),
            errorText: '',
            isLoading: true,
            questionIndex: -1,
        }
    }

    private _onSubmitAnswer(content: string, nextQuestionIndex?: number) {
        const questions = this.props.questions;
        const index = this.state.questionIndex;
        const model: IAnswerModel = {
            id: 0,
            content: content,
            sessionId: '',
            timeSpent: this._timeSpentSecond,
            questionId: questions[index].id,
            ownerIP: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        fetch('api/Answer', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: "same-origin",
            method: 'POST',
            body: JSON.stringify(model)
        })
            .then(response => response.json() as Promise<IAnswerModel>)
            .then(data => {
                let answers = new Map<number, IAnswerModel>();
                let answerList: IAnswerModel[] = [];
                this.state.answerMap.forEach((v, k) => {
                    if (k != data.id) {
                        answers.set(k, v);
                        answerList.push(v);
                    }
                });
                answers.set(data.questionId, data);
                answerList.push(data);
                this.setState({
                    answerMap: answers,
                    answerList: answerList,
                });
            })
            .catch(error => {
                this.setStateWhenMount({
                    errorText: error.message
                });
            });

        const nextIndex = nextQuestionIndex != undefined ? nextQuestionIndex : this.state.questionIndex + 1;
        if (nextIndex < questions.length) {
            this._loadQuestion(nextIndex);
        } else {
            this._loadQuestion(-2); // End 
        }
    }

    private _loadAnswers() {
        fetch('api/Answer', {
            credentials: "same-origin",
        })
            .then(response => response.json() as Promise<IAnswerModel[]>)
            .then(data => {
                let answers = new Map<number, IAnswerModel>();
                data.map(o => {
                    answers.set(o.questionId, o);
                });

                this.setStateWhenMount({
                    answerList: data,
                    answerMap: answers,
                });
            })
            .catch(error => {
                this.setStateWhenMount({
                    errorText: error.message
                });
            });
    }

    private _loadQuestion(index: number) {
        if (this._timer != null) {
            clearInterval(this._timer);
        }
        this._timeSpentSecond = 0;
        this._timer = setInterval(this._timeSpent, 1000);

        this.setState({
            questionIndex: index,
        });
    }

    private _timeSpent() {
        this._timeSpentSecond++;
    }

    componentDidMount() {
        super.componentDidMount();
        this._loadAnswers();
    }

    render() {

        const questionaire = this.props.questionaire;
        const questions = this.props.questions;
        const questionIndex = this.state.questionIndex;
        const question = questionIndex >= 0 ? questions[questionIndex] : null;
        const answerList = this.state.answerList;
        const answerMap = this.state.answerMap;
        const answer = question ? answerMap.get(question.id) : undefined;

        let content;
        if (questionIndex == -1) {
            content = (<div className='xhx-QuestionaireAnswerForm-Description'>
                <p>{questionaire.description}</p>
                <PrimaryButton
                    text="Let's Start"
                    onClick={() => { this._loadQuestion(0); }}
                />
            </div>);
        } else if (questionIndex == -2) {
            content = (<div className='xhx-QuestionaireAnswerForm-Description'>
                <p>This is the End of the Questionaire. Thank you!</p>
                <PrimaryButton
                    text="Close"
                    onClick={() => { window.close(); }}
                />
            </div>);
        } else {
            const question = questions[questionIndex];
            const componentProps: IShowQuestionTypeComponentProps = {
                question: question,
                questions: questions,
                answers: answerList,
                createContent: question.content,
                content: answer == undefined ? '' : answer.content,
                onSubmit: this._onSubmitAnswer,
            };

            content = (<div id={`question${questionIndex}`} className='xhx-QuestionaireAnswerForm-Question'>
                <DynamicQuestionTypeComponent
                    questionTypeId={question.typeId}
                    formType='show'
                    componentProps={componentProps}
                />
            </div>);
        }

        return (
            <div className='xhx-QuestionaireAnswerForm'>
                {content}
            </div>
        );
    }
}
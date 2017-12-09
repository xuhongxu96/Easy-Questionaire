import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ThreeLevelBreadcrumb } from '../ThreeLevelBreadcrumb';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { IQuestionModel } from '../../../models/IQuestionModel';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';
import { SelectQuestionTypeDialog } from '../questionType/SelectQuestionTypeDialog';
import { HasFetchComponent } from '../HasFetchComponent';
import { QuestionItem } from './QuestionItem'
import { ErrorBar } from '../ErrorBar';
import { InfoBar } from '../InfoBar';

export interface IQuestionEditorProps {
    model: IQuestionaireModel,
    guid: string,
}

export interface IQuestionEditorState {
    questions: IQuestionModel[],
    errorText: string,
    isSelectQuestionTypeDialogHidden: boolean,
    onQuestionTypeSelected: (questionType: IQuestionTypeModel) => void,
}

export class QuestionEditor extends HasFetchComponent<IQuestionEditorProps, IQuestionEditorState> {

    constructor(props: IQuestionEditorProps) {
        super(props);

        this.addQuestion = this.addQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.moveQuestion = this.moveQuestion.bind(this);
        this._onDialogDismiss = this._onDialogDismiss.bind(this);

        this.state = {
            questions: [],
            errorText: '',
            isSelectQuestionTypeDialogHidden: true,
            onQuestionTypeSelected: () => { }
        };
    }

    private _fetchQuestions() {
        return fetch('api/Questionaire/questions/' + this.props.model.id)
            .then(response => response.json() as Promise<IQuestionModel[]>)
            .then(data => {
                data = data.sort((a, b) => a.order - b.order);
                this.setStateWhenMount({ questions: data });
            })
            .catch(error => {
                this.setStateWhenMount({ errorText: error.message });
            });
    }

    private _onDialogDismiss() {
        this.setState({
            isSelectQuestionTypeDialogHidden: true
        });
    }

    addQuestion(index?: number) {

        const questions = this.state.questions.slice(0);

        this.setState({
            isSelectQuestionTypeDialogHidden: false,
            onQuestionTypeSelected: (questionType) => {
                if (index == undefined) {
                    index = questions.length;
                }

                const question = {
                    id: 0,
                    questionaireId: this.props.model.id,
                    typeId: questionType.id,
                    order: index,
                    content: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                fetch(`api/Question/${this.props.guid}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(question)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data['guid']) {
                            this.setStateWhenMount({
                                errorText: data['guid'],
                                isSelectQuestionTypeDialogHidden: true,
                            });
                        } else {
                            this._fetchQuestions().then(() => {
                                this.setStateWhenMount({ isSelectQuestionTypeDialogHidden: true });
                            });
                        }
                    })
                    .catch(error => {
                        this.setStateWhenMount({ errorText: error.message });
                    });

            }
        });
    }

    removeQuestion(index: number) {

        const question = this.state.questions[index];

        fetch(`api/Question/${question.id}/${this.props.guid}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data['guid']) {
                    this.setStateWhenMount({ errorText: data['guid'] });
                } else {
                    this._fetchQuestions();
                }
            })
            .catch(error => {
                this.setStateWhenMount({ errorText: error.message });
            });

    }

    moveQuestion(index: number, targetIndex: number) {

        const question = this.state.questions[index];

        fetch(`api/Question/move/${question.id}/${targetIndex}/${this.props.guid}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data['guid']) {
                    this.setStateWhenMount({ errorText: data['guid'] });
                } else {
                    this._fetchQuestions();
                }
            })
            .catch(error => {
                this.setStateWhenMount({ errorText: error.message });
            });
    }

    componentDidMount() {
        super.componentDidMount();

        this._fetchQuestions();
    }

    render() {

        const errorText = this.state.errorText;
        const questions = this.state.questions;
        const isDialogHidden = this.state.isSelectQuestionTypeDialogHidden;
        const onSelected = this.state.onQuestionTypeSelected;

        return (
            <div className='xhx-QuestionEditor'>

                <ErrorBar
                    errorText={errorText}
                    onDismiss={() => this.setState({ errorText: '' })}
                />

                <PrimaryButton
                    text='Add New Question'
                    onClick={() => { this.addQuestion(); }}
                />

                <SelectQuestionTypeDialog
                    hidden={isDialogHidden}
                    onDismiss={this._onDialogDismiss}
                    onSelected={(questionType) => {
                        onSelected(questionType);
                    }}
                    message='Please select a question type for your new question.'
                />

                {questions.map((question, index) => {
                    return (
                        <QuestionItem
                            key={question.id}
                            question={question}
                            questions={questions}
                            onRemove={this.removeQuestion}
                            onInsert={this.addQuestion}
                            onMove={this.moveQuestion}
                        />
                    );
                })}

            </div>
        );
    }
}
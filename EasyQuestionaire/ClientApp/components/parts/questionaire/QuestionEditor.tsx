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
import { StatusBar, MessageBarType } from '../StatusBar';
import { Layer } from 'office-ui-fabric-react/lib/Layer';

export interface IQuestionEditorProps {
    model: IQuestionaireModel,
    guid: string,
    onFinished: () => void,
}

export interface IQuestionEditorState {
    questions: IQuestionModel[],
    statusText: string,
    statusType: MessageBarType,
    isStatusAutoDismiss: boolean,
    isSelectQuestionTypeDialogHidden: boolean,
    onQuestionTypeSelected: (questionType: IQuestionTypeModel) => void,
}

export class QuestionEditor extends HasFetchComponent<IQuestionEditorProps, IQuestionEditorState> {

    private _saveInterval = 3000;
    private _saveTimer: number | null = null;
    private _changedQuestions = new Map<number, string>();


    constructor(props: IQuestionEditorProps) {
        super(props);

        this.addQuestion = this.addQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.moveQuestion = this.moveQuestion.bind(this);
        this.saveQuestion = this.saveQuestion.bind(this);
        this.saveAllQuestions = this.saveAllQuestions.bind(this);
        this._onQuestionChanged = this._onQuestionChanged.bind(this);
        this._onDialogDismiss = this._onDialogDismiss.bind(this);

        this.state = {
            questions: [],
            statusText: 'Loading...',
            statusType: MessageBarType.info,
            isStatusAutoDismiss: true,
            isSelectQuestionTypeDialogHidden: true,
            onQuestionTypeSelected: () => { }
        };
    }

    private _fetchQuestions() {

        this.setState({
            statusText: 'Loading...',
            statusType: MessageBarType.info
        });

        return fetch('api/Questionaire/questions/' + this.props.model.id)
            .then(response => response.json() as Promise<IQuestionModel[]>)
            .then(data => {
                data = data.sort((a, b) => a.order - b.order);
                this.setStateWhenMount({
                    questions: data,
                    statusText: 'Loaded.',
                    statusType: MessageBarType.success,
                });
            })
            .catch(error => {
                this.setStateWhenMount({
                    statusText: error.message,
                    statusType: MessageBarType.error
                });
            });
    }

    private _onDialogDismiss() {
        this.setState({
            isSelectQuestionTypeDialogHidden: true
        });
    }

    private _pendingPromises: Promise<any> | null = null;
    private _addPromise(promiseFunction: () => Promise<any>) {

        if (this._pendingPromises == null) {
            this._pendingPromises = promiseFunction();
        } else {
            this._pendingPromises.then(() => {
                this._pendingPromises = promiseFunction();
            });
        }
    }

    addQuestion(index?: number) {

        const questions = this.state.questions.slice(0);

        this.setState({
            statusText: 'Adding New Question...',
            statusType: MessageBarType.info,
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

                this._addPromise(() => {
                    return fetch(`api/Question/${this.props.guid}`, {
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
                                    statusText: data['guid'],
                                    statusType: MessageBarType.error,
                                    isSelectQuestionTypeDialogHidden: true,
                                });
                            } else {
                                if (index == null) {
                                    questions.push(data);
                                } else {
                                    questions.splice(index, 0, data);
                                    for (let i = index + 1; i < questions.length; ++i) {
                                        questions[i].order++;
                                    }
                                }
                                this.setStateWhenMount({
                                    statusText: 'Saved.',
                                    statusType: MessageBarType.success,
                                    isSelectQuestionTypeDialogHidden: true,
                                    questions: questions,
                                });
                            }
                        })
                        .catch(error => {
                            this.setStateWhenMount({
                                statusText: error.message,
                                statusType: MessageBarType.error,
                            });
                        });
                });

            }
        });
    }

    removeQuestion(index: number) {

        const questions = this.state.questions.slice(0);
        const question = this.state.questions[index];

        this.setState({
            statusText: 'Removing Question...',
            statusType: MessageBarType.info,
        });

        questions.splice(index, 1);
        for (let i = index; i < questions.length; ++i) {
            questions[i].order--;
        }

        this._addPromise(() => {
            return fetch(`api/Question/${question.id}/${this.props.guid}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data['guid']) {
                        this.setStateWhenMount({
                            statusText: data['guid'],
                            statusType: MessageBarType.error,
                        });
                    } else {
                        this.setStateWhenMount({
                            statusText: 'Saved.',
                            statusType: MessageBarType.success,
                            questions: questions,
                        });
                    }
                })
                .catch(error => {
                    this.setStateWhenMount({
                        statusText: error.message,
                        statusType: MessageBarType.error
                    });
                });
        });

    }

    moveQuestion(index: number, targetIndex: number) {

        const questions = this.state.questions.slice(0);
        const question = this.state.questions[index];

        this.setState({
            statusText: 'Moving Question...',
            statusType: MessageBarType.info,
        });

        [questions[index].order, questions[targetIndex].order] = [questions[targetIndex].order, questions[index].order];
        [questions[index], questions[targetIndex]] = [questions[targetIndex], questions[index]];

        this._addPromise(() => {
            return fetch(`api/Question/move/${question.id}/${targetIndex}/${this.props.guid}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    if (data['guid']) {
                        this.setStateWhenMount({
                            statusText: data['guid'],
                            statusType: MessageBarType.error,
                        });
                    } else {
                        this.setStateWhenMount({
                            statusText: 'Saved.',
                            statusType: MessageBarType.success,
                            questions: questions,
                        });
                    }
                })
                .catch(error => {
                    this.setStateWhenMount({
                        statusText: error.message,
                        statusType: MessageBarType.error,
                    });
                });
        });
    }

    saveQuestion(index: number, content: string) {

        const questions = this.state.questions.slice(0);
        questions[index].content = content;

        const question = questions[index];

        this.setState({
            statusText: 'Saving Questions...',
            statusType: MessageBarType.info,
        });

        this._addPromise(() => {
            return fetch(`api/Question/${question.id}/${this.props.guid}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: question.id,
                    content: content,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data['guid']) {
                        this.setStateWhenMount({
                            statusText: data['guid'],
                            statusType: MessageBarType.error,
                        });
                    } else {
                        this.setStateWhenMount({
                            statusText: 'Saved.',
                            statusType: MessageBarType.success,
                            isStatusAutoDismiss: true,
                            questions: questions,
                        });
                    }
                })
                .catch(error => {
                    this.setStateWhenMount({
                        statusText: error.message,
                        statusType: MessageBarType.error,
                    });
                });
        });
    }

    saveAllQuestions() {

        if (this._changedQuestions.size == 0) return;

        this.setState({
            statusText: 'Saving Questions...',
            statusType: MessageBarType.info,
        });

        let contentList: { id: number, content: string }[] = [];
        this._changedQuestions.forEach((content, id) => {
            contentList.push({
                id: id,
                content: content
            });
        })

        this._addPromise(() => {
            return fetch(`api/Question/saveAll/${this.props.guid}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contentList)
            })
                .then(response => response.json())
                .then(data => {
                    if (data['guid']) {
                        this.setStateWhenMount({
                            statusText: data['guid'],
                            statusType: MessageBarType.error,
                        });
                    } else {
                        this._changedQuestions.clear();
                        this.setStateWhenMount({
                            statusText: 'Saved.',
                            statusType: MessageBarType.success,
                            isStatusAutoDismiss: true,
                        });
                    }
                })
                .catch(error => {
                    this.setStateWhenMount({
                        statusText: error.message,
                        statusType: MessageBarType.error,
                    });
                });
        });
    }

    private _onQuestionChanged(index: number, content: string) {
        const questions = this.state.questions.slice(0);
        questions[index].content = content;

        this.setState({
            statusText: 'Changed',
            statusType: MessageBarType.warning,
            isStatusAutoDismiss: false,
            questions: questions,
        });

        this._changedQuestions.set(questions[index].id, content);
        if (this._saveTimer != null) {
            clearTimeout(this._saveTimer);
        }
        this._saveTimer = setTimeout(this.saveAllQuestions, this._saveInterval);
    }

    componentDidMount() {
        super.componentDidMount();

        this._fetchQuestions();
    }


    render() {

        const questions = this.state.questions;
        const isDialogHidden = this.state.isSelectQuestionTypeDialogHidden;
        const onSelected = this.state.onQuestionTypeSelected;
        const statusText = this.state.statusText;
        const statusType = this.state.statusType;
        const isStatusAutoDismiss = this.state.isStatusAutoDismiss;

        return (
            <div className='xhx-QuestionEditor'>

                <PrimaryButton
                    text='Add New Question'
                    onClick={() => { this.addQuestion(); }}
                />

                <Layer>
                    <StatusBar
                        text={statusText}
                        status={statusType}
                        autoDismiss={isStatusAutoDismiss}
                    />
                </Layer>


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
                            onChanged={this._onQuestionChanged}
                        />
                    );
                })}

                <PrimaryButton
                    text='Save'
                    onClick={() => {
                        this.saveAllQuestions();
                        this.props.onFinished();
                    }}
                />

            </div>
        );
    }
}
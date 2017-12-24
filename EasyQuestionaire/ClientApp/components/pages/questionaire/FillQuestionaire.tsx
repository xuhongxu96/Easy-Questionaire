import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { IQuestionModel } from '../../../models/IQuestionModel';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { QuestionaireAnswerForm } from '../../parts/questionaire/QuestionaireAnswerForm';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';

export interface IFillQuestionaireProps {
    id: number,
}

export interface IFillQuestionaireState {
    model: IQuestionaireModel | null,
    questions: IQuestionModel[],
    errorText: string,
    isLoading: boolean,
}

export class FillQuestionaire extends HasFetchComponent<RouteComponentProps<IFillQuestionaireProps>, IFillQuestionaireState> {

    constructor(props: RouteComponentProps<IFillQuestionaireProps>) {
        super(props);

        this.state = {
            model: null,
            questions: [],
            errorText: '',
            isLoading: true,
        }
    }

    private _fetchModel() {
        const id = this.props.match.params.id;
        Promise.all([
            fetch('api/Questionaire/' + id)
                .then(response => response.json() as Promise<IQuestionaireModel>)
                .then(data => {
                    this.setStateWhenMount({
                        model: data
                    });
                })
                .catch(error => { this.setStateWhenMount({ errorText: error.message }); }),

            fetch('api/Questionaire/questions/' + id)
                .then(response => response.json() as Promise<IQuestionModel[]>)
                .then(data => {
                    data = data.sort((a, b) => a.order - b.order);
                    this.setStateWhenMount({
                        questions: data,
                    });
                })
                .catch(error => {
                    this.setStateWhenMount({
                        errorText: error.message,
                    });
                })])
            .then(() => this.setStateWhenMount({
                isLoading: false,
            }));
    }

    componentDidMount() {
        super.componentDidMount();
        this._fetchModel();
    }

    render() {

        const model = this.state.model;
        const questions = this.state.questions;
        const isLoading = this.state.isLoading;
        const errorText = this.state.errorText;

        return (
            <div className='xhx-Page xhx-FillQuesitonaire'>

                {isLoading && <InfoBar
                    infoText='Loading...'
                />}

                {errorText != '' && <ErrorBar
                    errorText={errorText}
                />}

                {model && <div className='xhx-FillQuestionaire-Content'>

                    <h1 className='xhx-FillQuestionaire-Header'>{model.title}</h1>
                    
                    <QuestionaireAnswerForm
                        questionaire={model}
                        questions={questions}
                    />

                </div>}

            </div>
        );
    }
}
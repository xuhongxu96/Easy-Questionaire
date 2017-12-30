import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { QuestionaireForm } from '../../parts/questionaire/QuestionaireForm';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';

export interface IEditQuestionaireState {
    model: IQuestionaireModel | null,
    isLoading: boolean,
    errorText: string,
}

export class EditQuestionaire extends HasFetchComponent<RouteComponentProps<{ id: number, guid: string }>, IEditQuestionaireState> {

    constructor(props: RouteComponentProps<{ id: number, guid: string }>) {
        super(props);

        this.state = {
            model: null,
            isLoading: true,
            errorText: '',
        }

    }

    private _fetchModel() {
        const id = this.props.match.params.id;
        fetch('api/questionaire/' + id)
            .then(response => response.json() as Promise<IQuestionaireModel>)
            .then(data => this.setStateWhenMount({
                model: data,
                isLoading: false
            }))
            .catch(error => this.setStateWhenMount({ errorText: error.message, isLoading: false }));
    }

    componentDidMount() {
        super.componentDidMount();
        this._fetchModel();
    }

    public render() {

        const isLoading = this.state.isLoading;
        const errorText = this.state.errorText;
        const model = this.state.model;
        const modelName = model ? model.title : this.props.match.params.id.toString();


        return (<div className='xhx-Page xhx-EditQuestionaire'>
            <ThreeLevelBreadcrumb
                title='Questionaire'
                subtitle='Edit'
                subsubtitle={modelName}
                history={this.props.history}
                url='/questionaire'
            />

            <ErrorBar
                errorText={errorText}
                onDismiss={() => this.setState({ errorText: '' })}
            />

            <InfoBar
                infoText={isLoading ? 'Loading...' : ''}
            />

            {model && <QuestionaireForm
                model={model}
                guid={this.props.match.params.guid}
                onSubmitted={(questionaire) => {
                    this.props.history.push(`/questionaire/edit/questions/${questionaire.id}/${questionaire.guid}`);
                }}
            />}
        </div>);
    }
}

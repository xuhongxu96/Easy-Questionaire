import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { QuestionTypeForm } from '../../parts/questionType/QuestionTypeForm';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';
import { HasFetchComponent } from '../../parts/HasFetchComponent';

export interface IViewQuestionTypeState {
    srcModel: IQuestionTypeModel | null,
    isLoading: boolean,
    errorText: string,
}

export class ViewQuestionType extends HasFetchComponent<RouteComponentProps<{ id: number }>, IViewQuestionTypeState> {

    constructor(props: RouteComponentProps<{ id: number }>) {
        super(props);

        this.state = {
            srcModel: null,
            isLoading: true,
            errorText: '',
        }
    }

    private _fetchModel() {
        const id = this.props.match.params.id;
        fetch('api/questionType/' + id)
            .then(response => response.json() as Promise<IQuestionTypeModel>)
            .then(data => this.setStateWhenMount({ srcModel: data, isLoading: false }))
            .catch(error => this.setStateWhenMount({ errorText: error, isLoading: false }));
    }

    componentDidMount() {
        super.componentDidMount();
        this._fetchModel();
    }

    render() {

        const isLoading = this.state.isLoading;
        const errorText = this.state.errorText;
        const srcModel = this.state.srcModel;
        const modelName = srcModel ? srcModel.name : this.props.match.params.id.toString();

        return (<div className='xhx-CloneQuestionType'>
            <ThreeLevelBreadcrumb title='Question Type' subtitle='View' subsubtitle={modelName} history={this.props.history} url='/questionType' />

            <ErrorBar
                errorText={errorText}
                onDismiss={() => this.setState({ errorText: '' })}
            />

            {isLoading && <InfoBar
                infoText='Loading...'
            />}

            {srcModel && <QuestionTypeForm
                model={srcModel}
                isOnlyView={true}
            />}

        </div>);
    }
}

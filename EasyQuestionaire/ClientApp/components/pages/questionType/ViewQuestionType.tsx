﻿import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { TwoLevelBreadcrumb } from '../../parts/TwoLevelBreadcrumb';
import { QuestionTypeForm } from '../../parts/questionType/QuestionTypeForm';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';

export interface IViewQuestionTypeState {
    srcModel: IQuestionTypeModel | null,
    isLoading: boolean,
    errorText: string,
}

export class ViewQuestionType extends React.Component<RouteComponentProps<{ id: number }>, IViewQuestionTypeState> {

    constructor(props: RouteComponentProps<{ id: number }>) {
        super(props);

        this.state = {
            srcModel: null,
            isLoading: true,
            errorText: '',
        }
    }

    private _loadModel() {
        const id = this.props.match.params.id;
        fetch('api/questionType/' + id)
            .then(response => response.json() as Promise<IQuestionTypeModel>)
            .then(data => this.setState({ srcModel: data, isLoading: false }))
            .catch(error => { this.setState({ errorText: error, isLoading: false }); });
    }

    public componentDidMount() {
        this._loadModel();
    }

    public render() {

        const isLoading = this.state.isLoading;
        const errorText = this.state.errorText;
        const srcModel = this.state.srcModel;
        const modelName = srcModel ? srcModel.name : this.props.match.params.id;

        return (<div className='xhx-CloneQuestionType'>
            <TwoLevelBreadcrumb title='Question Type' subtitle={'View: ' + modelName} history={this.props.history} />

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

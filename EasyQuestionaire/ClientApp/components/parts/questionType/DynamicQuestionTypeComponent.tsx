import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { InfoBar } from '../../parts/InfoBar';
import { IQuestionModel } from '../../../models/IQuestionModel';
// import { IAnswerModel } from '../../../models/IAnswerModel';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';

export interface ICreateQuestionTypeComponentProps {
    question: IQuestionModel,
    questions: IQuestionModel[],
    content: string, // save settings in [content]
    onContentChanged: (content: string) => void,
}

export interface IShowQuestionTypeComponentProps {
    question: IQuestionModel,
    questions: IQuestionModel[],
    // answers: IAnswerModel[],
    createContent: string, // [ICreateQuestionTypeComponentProps.content] settings of the component
    content: string, // save answer in [content]
    onSubmit: (content: string, nextQuestionIndex?: number) => void,
}

export interface IDynamicQuestionTypeComponentProps {
    questionTypeId: number,
    formType: 'create' | 'show',
    componentProps: ICreateQuestionTypeComponentProps | IShowQuestionTypeComponentProps,
}

export interface IDynamicQuestionTypeComponentState {
    component: any,
}

export class DynamicQuestionTypeComponent
    extends HasFetchComponent<IDynamicQuestionTypeComponentProps, IDynamicQuestionTypeComponentState> {

    constructor(props: IDynamicQuestionTypeComponentProps) {
        super(props);

        this.state = {
            component: null,
        }
    }

    componentDidMount() {
        super.componentDidMount();

        fetch('api/QuestionType/' + this.props.questionTypeId)
            .then(response => response.json() as Promise<IQuestionTypeModel>)
            .then(data => {
                let code = this.props.formType == 'create' ? data.compiledCreateForm : data.compiledShowForm;
                let requireComponent = eval(`(function (exports, React) {` + code + `})`);
                let context: any = {};
                requireComponent(context, React);
                this.setStateWhenMount({ component: context.ExampleQuestionType });
            })
            .catch(error => console.log(error));
    }

    render() {

        let Component = this.state.component;
        let componentProps = this.props.componentProps;

        return (
            <div>

                {!Component && <InfoBar
                    infoText='Loading...'
                />}

                {Component &&
                    <Component
                        {...componentProps}
                    />
                }
            </div>
        );
    }
}
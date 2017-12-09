import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { QuestionTypeForm } from '../../parts/questionType/QuestionTypeForm';

export class CreateQuestionType extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (<div className='xhx-CreateQuestionType'>
            <ThreeLevelBreadcrumb title='Question Type' subtitle='Create New' history={this.props.history} url='/questionType' />
            <QuestionTypeForm />
        </div>);
    }
}

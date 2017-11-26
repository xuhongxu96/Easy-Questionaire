import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { TwoLevelBreadcrumb } from '../../parts/TwoLevelBreadcrumb';
import { QuestionTypeForm } from '../../parts/questionType/QuestionTypeForm';

export class CreateQuestionType extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (<div className='xhx-CreateQuestionType'>
            <TwoLevelBreadcrumb title='Question Type' subtitle='Create New' history={this.props.history} />
            <QuestionTypeForm />
        </div>);
    }
}

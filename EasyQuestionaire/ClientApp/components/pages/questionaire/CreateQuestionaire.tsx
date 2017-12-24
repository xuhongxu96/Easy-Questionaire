import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { QuestionaireForm } from '../../parts/questionaire/QuestionaireForm';

export class CreateQuestionaire extends React.Component<RouteComponentProps<{}>, {}> {

    public render() {
        return (<div className='xhx-Page xhx-CreateQuestionaire'>
            <ThreeLevelBreadcrumb title='Questionaire' subtitle='Create New' history={this.props.history} url='/questionaire' />
            <QuestionaireForm
                type='create'
                onSubmitted={(questionaire) => {
                    this.props.history.push(`/questionaire/edit/questions/${questionaire.id}/${questionaire.guid}`);
                }}
            />
        </div>);
    }
}

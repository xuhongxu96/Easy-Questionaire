import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { TwoLevelBreadcrumb } from '../../parts/TwoLevelBreadcrumb';
import { QuestionaireForm } from '../../parts/questionaire/QuestionaireForm';

export class CreateQuestionaire extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (<div className='xhx-Page xhx-CreateQuestionaire'>
            <TwoLevelBreadcrumb title='Questionaire' subtitle='Create New' history={this.props.history} url='/questionaire' />
            <QuestionaireForm />
        </div>);
    }
}

import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { QuestionaireList } from '../parts/QuestionaireList';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';

export class Questionaire extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <Breadcrumb
                items={[
                    { text: 'Questionaire', 'key': 'Questionaire' },
                ]}
                ariaLabel={'Website breadcrumb'}
            />
            <QuestionaireList />
        </div>;
    }
}

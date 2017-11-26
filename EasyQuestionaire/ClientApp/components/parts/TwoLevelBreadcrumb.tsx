import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { History } from 'history';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';

export function TwoLevelBreadcrumb(props: { title: string, subtitle?: string, history?: History }) {
    if (props.subtitle) {
        return <Breadcrumb
            items={[
                { text: props.title, 'key': props.title, onClick: () => props.history && props.history.goBack() },
                { text: props.subtitle, 'key': props.subtitle }
            ]}
            ariaLabel={'Website breadcrumb'}
        />;
    } else {
        return <Breadcrumb
            items={[
                { text: props.title, 'key': props.title },
            ]}
            ariaLabel={'Website breadcrumb'}
        />;
    }

}
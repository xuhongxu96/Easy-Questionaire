import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { History } from 'history';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';

export function ThreeLevelBreadcrumb(props: { title: string, subtitle?: string, subsubtitle?: string, history?: History, url?: string }) {
    let items;
    if (props.subsubtitle && props.subtitle) {
        items = [
            { text: props.title, 'key': props.title, onClick: () => props.history && props.url && props.history.push(props.url) },
            { text: props.subtitle, 'key': props.subtitle },
            { text: props.subsubtitle, 'key': props.subsubtitle }
        ];
    }
    else if (props.subtitle) {
        items = [
            { text: props.title, 'key': props.title, onClick: () => props.history && props.url && props.history.push(props.url) },
            { text: props.subtitle, 'key': props.subtitle }
        ];
    } else {
        items = [
            { text: props.title, 'key': props.title },
        ];
    }
    return <Breadcrumb
        className='xhx-ThreeLevelBreadcrumb'
        items={items}
        ariaLabel={'Website breadcrumb'}
    />;
}
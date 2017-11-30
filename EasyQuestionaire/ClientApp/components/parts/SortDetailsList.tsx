import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IDetailsListProps,
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    IColumn,
    SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';

export interface ISortDetailsListProps extends IDetailsListProps {
    id: number,
}

export class SortDetailsList extends React.Component<ISortDetailsListProps, {}> {
    constructor(props: ISortDetailsListProps) {
        super(props);
    }

    render() {

        const { id, ...others } = this.props;

        return (<DetailsList
            className='xhx-SortDetailsList'
            {...others}
        />);
    }
}
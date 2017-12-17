import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    IColumn,
    SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';
import { HasFetchComponent } from '../../parts/HasFetchComponent';

export interface IQuestionTypeListState {
    items: IQuestionTypeModel[],
    columns: IColumn[],
    errorText: string,
    isLoading: boolean,
}

export interface IQuestionTypeListProps {
    filterText: string,
    onReload: () => void,
    onSelected: (selection: Selection) => void
}

export class QuestionTypeList extends HasFetchComponent<IQuestionTypeListProps, IQuestionTypeListState> {

    private _items: IQuestionTypeModel[];
    private _selection: Selection;

    constructor() {
        super()

        this._onColumnClick = this._onColumnClick.bind(this);
        this._sortItems = this._sortItems.bind(this);
        this._selection = new Selection({
            onSelectionChanged: () => this._onSelectionChanged()
        });

        const _columns: IColumn[] = [
            {
                key: 'name',
                name: 'Name',
                fieldName: 'name',
                minWidth: 100,
                maxWidth: 300,
                isRowHeader: true,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item: IQuestionTypeModel) => {
                    return (
                        <a href={'/questionType/view/' + item.id}>
                            {item.name}
                        </a>
                    );
                },
            },
            {
                key: 'updatedAt',
                name: 'Updated At',
                fieldName: 'updatedAt',
                minWidth: 100,
                maxWidth: 150,
                isRowHeader: false,
                isResizable: true,
                isSorted: true,
                isSortedDescending: true,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item: IQuestionTypeModel) => {
                    return (
                        <span>
                            {item.updatedAt.toLocaleString()}
                        </span>
                    );
                },
            },
            {
                key: 'createdAt',
                name: 'Created At',
                fieldName: 'createdAt',
                minWidth: 100,
                maxWidth: 150,
                isRowHeader: false,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item: IQuestionTypeModel) => {
                    return (
                        <span>
                            {item.createdAt.toLocaleString()}
                        </span>
                    );
                },

            }
        ];

        this.state = {
            items: [],
            columns: _columns,
            errorText: '',
            isLoading: true,
        }
    }

    private _onSelectionChanged() {
        this.props.onSelected(this._selection);
    }

    private _loadItems() {
        fetch('api/QuestionType/')
            .then(response => response.json() as Promise<IQuestionTypeModel[]>)
            .then(data => {
                if (data != null) {
                    this._items = data;
                }

                if (this._didMount) {
                    this.setState({
                        items: this._items,
                        isLoading: false,
                    });
                    this.props.onReload();
                }
            })
            .catch(err => this.setStateWhenMount({ errorText: err.toString(), isLoading: false }));
    }

    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
        const { columns, items } = this.state;
        let newItems: IQuestionTypeModel[] = items.slice();
        let newColumns: IColumn[] = columns.slice();
        let currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
            return column.key === currCol.key;
        })[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = false;
            }
        });
        newItems = this._sortItems(newItems, currColumn.fieldName, currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            items: newItems
        });
    }

    private _sortItems(items: IQuestionTypeModel[], sortBy: string, descending = false): IQuestionTypeModel[] {
        if (descending) {
            return items.sort((a: IQuestionTypeModel, b: IQuestionTypeModel) => {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            });
        } else {
            return items.sort((a: IQuestionTypeModel, b: IQuestionTypeModel) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                return 0;
            });
        }
    }

    public componentDidMount() {
        super.componentDidMount();
        this._loadItems();
    }

    public componentWillUnmount() {
        super.componentWillUnmount();
        this._items = [];
    }

    public render() {

        const columns = this.state.columns;
        const errorText = this.state.errorText;
        const filterText = this.props.filterText;
        const isLoading = this.state.isLoading;
        const rawItems = this.state.items;
        const items = rawItems.filter(item =>
            item.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0);

        return (
            <FocusZone direction={FocusZoneDirection.vertical}>

                <ErrorBar
                    errorText={errorText}
                    onDismiss={() => this.setState({ errorText: '' })}
                />

                <DetailsList
                    className='xhx-QuestionTypeList'
                    items={items}
                    columns={columns}
                    selectionMode={SelectionMode.single}
                    selection={this._selection}
                    setKey='questionTypeList'
                />

                {isLoading && <InfoBar
                    infoText='Loading...'
                />}

                {!isLoading && errorText == '' && items.length == 0 && <InfoBar
                    infoText='No QuestionType.'
                />}

            </FocusZone >
        );
    }
}

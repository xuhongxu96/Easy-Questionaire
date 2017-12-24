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
import * as moment from 'moment';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';


export interface IQuestionaireListState {
    items: IQuestionaireModel[],
    columns: IColumn[],
    errorText: string,
    isLoading: boolean,
}

export interface IQuestionaireListProps {
    filterText: string,
    filterEnabled: boolean | null,
    onReload: () => void,
    onSelected: (selection: Selection) => void,
}

export class QuestionaireList extends HasFetchComponent<IQuestionaireListProps, IQuestionaireListState> {

    private _items: IQuestionaireModel[];
    private _selection: Selection;

    private _filterStates = [
        { key: 'All', text: 'All' },
        { key: 'Enabled', text: 'Available' },
        { key: 'Disabled', text: 'Stopped' },
    ];
    private _filterStatesMap: { [key: string]: boolean | null } = {
        'All': null,
        'Available': true,
        'Stopped': false
    };

    constructor(props: IQuestionaireListProps) {
        super(props)

        this._onColumnClick = this._onColumnClick.bind(this);
        this._sortItems = this._sortItems.bind(this);

        this._selection = new Selection({
            onSelectionChanged: () => this._onSelectionChanged()
        });

        const _columns: IColumn[] = [
            {
                key: 'title',
                name: 'Title',
                fieldName: 'title',
                minWidth: 100,
                maxWidth: 200,
                isRowHeader: true,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true
            },
            {
                key: 'description',
                name: 'Description',
                fieldName: 'description',
                minWidth: 150,
                maxWidth: 300,
                isRowHeader: false,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true
            },
            {
                key: 'status',
                name: 'Status',
                fieldName: 'isEnabled',
                minWidth: 80,
                maxWidth: 100,
                isRowHeader: false,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item: IQuestionaireModel) => {
                    return (
                        <span className={'xhx-QuestionaireList-Status ms-fontColor-white ' + (item.isEnabled ? 'ms-bgColor-green' : 'ms-bgColor-red')}>
                            {item.isEnabled ? 'Available' : 'Stopped'}
                        </span>
                    );
                },
            },
            {
                key: 'startDate',
                name: 'Start Date',
                fieldName: 'startDate',
                minWidth: 100,
                maxWidth: 150,
                isRowHeader: false,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item: IQuestionaireModel) => {
                    return (
                        <span>
                            {moment(item.startDate).format('L')}
                        </span>
                    );
                },
            },
            {
                key: 'endDate',
                name: 'End Date',
                fieldName: 'endDate',
                minWidth: 100,
                maxWidth: 150,
                isRowHeader: false,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item: IQuestionaireModel) => {
                    return (
                        <span>
                            {moment(item.endDate).format('L')}
                        </span>
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
                onRender: (item: IQuestionaireModel) => {
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
                onRender: (item: IQuestionaireModel) => {
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

    private _fetchItems() {
        fetch('api/Questionaire/')
            .then(response => response.json() as Promise<IQuestionaireModel[]>)
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
        let newItems: IQuestionaireModel[] = items.slice();
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
            items: newItems,
        });
        this._selection.setAllSelected(false);
    }

    private _sortItems(items: IQuestionaireModel[], sortBy: string, descending = false): IQuestionaireModel[] {
        if (descending) {
            return items.sort((a: IQuestionaireModel, b: IQuestionaireModel) => {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            });
        } else {
            return items.sort((a: IQuestionaireModel, b: IQuestionaireModel) => {
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
        this._fetchItems();
    }

    public componentWillUnmount() {
        this._items = [];
    }

    public render() {

        const columns = this.state.columns;
        const errorText = this.state.errorText;
        const filterText = this.props.filterText;
        const filterEnabled = this.props.filterEnabled;
        const isLoading = this.state.isLoading;
        const rawItems = this.state.items;
        const items = rawItems.filter(item =>
            (item.title.toLowerCase().indexOf(filterText.toLowerCase()) >= 0
            || item.description.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
            && (filterEnabled == undefined || item.isEnabled == filterEnabled));


        return (
            <FocusZone direction={FocusZoneDirection.vertical}>

                <ErrorBar
                    errorText={errorText}
                    onDismiss={() => this.setState({ errorText: '' })}
                />

                <DetailsList
                    className='xhx-QuestionaireList'
                    items={items}
                    columns={columns}
                    selectionMode={SelectionMode.single}
                    selection={this._selection}
                    setKey='questionaireList'
                />

                {isLoading && <InfoBar
                    infoText='Loading...'
                />}

                {!isLoading && errorText == '' && items.length == 0 && <InfoBar
                    infoText='No Questionaire.'
                />}

            </FocusZone >
        );
    }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { IQuestionaireModel } from '../../models/IQuestionaireModel';


export interface IQuestionaireListState {
    items: IQuestionaireModel[],
    filterText: string,
    filterEnabled: boolean | null,
    errorText: string,
    didJustMount: boolean,
    isLoading: boolean,
}

export class QuestionaireList extends React.Component<{}, IQuestionaireListState> {

    private _items: IQuestionaireModel[];
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

    constructor() {
        super()

        this._onFilterChanged = this._onFilterChanged.bind(this);
        this._onStateFilterChanged = this._onStateFilterChanged.bind(this);
        this._onMessageBarDismiss = this._onMessageBarDismiss.bind(this);

        this.state = {
            items: [],
            filterText: "",
            filterEnabled: null,
            errorText: '',
            didJustMount: true,
            isLoading: true,
        }
    }

    private _loadItems() {
        fetch('api/Questionaire/')
            .then(response => response.json() as Promise<IQuestionaireModel[]>)
            .then(data => {
                if (data == null) return;
                this._items = data;
                this.setState({ isLoading: false });
                this._onFilterChanged("");
            })
            .catch(err => this.setState({ errorText: err.toString(), didJustMount: false, isLoading: false }));
    }

    private _onFilterChanged(text: string) {

        if (this.state.errorText != null) return;

        const items = this._items;
        const filterEnabled = this.state.filterEnabled;

        this.setState({
            filterText: text,
            items: items.filter(item =>
                item.isEnabled == filterEnabled
                && (item.title.toLowerCase().indexOf(text.toLowerCase()) >= 0
                    || item.description.toLowerCase().indexOf(text.toLowerCase()) >= 0))
        });
    }

    private _onStateFilterChanged(option: IComboBoxOption, index: number, value: string) {

        if (this.state.errorText != null) return;

        const items = this._items;
        const text = this.state.filterText;
        const filterEnabled = this._filterStatesMap[value];

        this.setState({
            items: items.filter(item =>
                item.isEnabled == filterEnabled
                && (item.title.toLowerCase().indexOf(text.toLowerCase()) >= 0
                    || item.description.toLowerCase().indexOf(text.toLowerCase()) >= 0))
        });
    }

    private _onMessageBarDismiss() {
        this.setState({ errorText: '' });
    }

    private _onRenderCell(item: IQuestionaireModel, index: number | undefined): JSX.Element {
        return <div>{item.title}</div>
    }

    public componentDidMount() {
        this.setState({ didJustMount: true });
        this._loadItems();
    }

    public componentWillUnmount() {
        this._items = [];
        this.setState({
            items: [],
        });
    }

    public render() {

        const items = this.state.items;
        const errorText = this.state.errorText;
        const didJustMount = this.state.didJustMount;
        const isLoading = this.state.isLoading;

        let content = null;
        if (items.length == 0) {
            content = <div className={'ms-slideUpIn10'}>
                <MessageBar
                    messageBarType={MessageBarType.info}
                    isMultiline={false}>

                    {isLoading ? 'Loading...' : 'No Questionaire.'}

                </MessageBar>
            </div>;
        } else {
            content = <List
                className='xhx-QuestionaireList'
                items={items}
                onRenderCell={this._onRenderCell}
            />;
        }

        return (
            <FocusZone direction={FocusZoneDirection.vertical}>
                <TextField label={'Filter by title or description:'} onBeforeChange={this._onFilterChanged} />
                <ComboBox
                    defaultSelectedKey='All'
                    label='Questionaire state:'
                    id='combobox-questionaire-state'
                    ariaLabel='Questionaire State Filter'
                    allowFreeform={false}
                    autoComplete='off'
                    options={this._filterStates}
                    onChanged={this._onStateFilterChanged}
                />
                {!didJustMount &&
                    <div className={errorText == '' ? 'ms-slideUpOut10' : 'ms-slideUpIn10'}>
                        <MessageBar
                            messageBarType={MessageBarType.error}
                            isMultiline={false}
                            onDismiss={this._onMessageBarDismiss}>
                            {errorText}
                        </MessageBar>
                    </div>
                }

                {content}

            </FocusZone >
        );
    }
}

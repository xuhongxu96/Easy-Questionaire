import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { QuestionaireList } from '../../parts/questionaire/QuestionaireList';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { InputGuidDialog } from '../../parts/questionaire/InputGuidDialog';

export interface IQuestionaireState {
    filterText: string,
    filterEnabled: string,
    selectedModel: IQuestionaireModel | null,
    isInputGuidDialogHidden: boolean,
    inputGuidDialogErrorText: string,
    dialogType: 'edit' | 'report',
}

export class Questionaire extends React.Component<RouteComponentProps<{}>, IQuestionaireState> {

    private _filterStatesMap: { [key: string]: boolean | null } = {
        'All': null,
        'Available': true,
        'Stopped': false,
    };

    constructor() {
        super();

        this._onBindSearchBox = this._onBindSearchBox.bind(this);
        this._onSelected = this._onSelected.bind(this);
        this._onToggleSelect = this._onToggleSelect.bind(this);
        this._prepareEditQuestionaire = this._prepareEditQuestionaire.bind(this);
        this._prepareViewQuestionaireReport = this._prepareViewQuestionaireReport.bind(this);
        this._onFinishedInputGuid = this._onFinishedInputGuid.bind(this);

        this.state = {
            filterText: '',
            filterEnabled: 'All',
            selectedModel: null,
            isInputGuidDialogHidden: true,
            inputGuidDialogErrorText: '',
            dialogType: 'edit',
        }
    }

    private _onBindSearchBox(input: CommandBar | null) {
        if (input) {
            const textInput = (input.refs.searchSurface.firstChild as HTMLInputElement);
            const pThis = this;
            textInput.onkeyup = function () {
                const value = (this as HTMLInputElement).value;
                pThis.setState({
                    filterText: value ? value : ''
                });
            }
        }
    }

    private _onSelected(selection: Selection) {
        if (selection.getSelectedCount() == 1) {
            this.setState({
                selectedModel: (selection.getSelection()[0] as IQuestionaireModel)
            });
        } else {
            this.setState({
                selectedModel: null
            });
        }
    }

    private _onToggleSelect(ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem) {
        ev!.preventDefault();

        this.setState({
            filterEnabled: item!.key,
        });
    }

    private _prepareEditQuestionaire() {
        this.setState({
            isInputGuidDialogHidden: false,
            inputGuidDialogErrorText: '',
            dialogType: 'edit',
        });
    }

    private _prepareViewQuestionaireReport() {
        this.setState({
            isInputGuidDialogHidden: false,
            inputGuidDialogErrorText: '',
            dialogType: 'report',
        });
    }

    private _onFinishedInputGuid(type: 'edit' | 'report', guid: string) {

        const selectedModel = this.state.selectedModel;

        fetch(`api/Questionaire/check/${selectedModel ? selectedModel.id : ''}/${guid}`)
            .then(response => response.json())
            .then(data => {
                if (data['guid']) {
                    this.setState({
                        inputGuidDialogErrorText: data['guid'],
                    });
                } else {
                    this.setState({
                        isInputGuidDialogHidden: true,
                        inputGuidDialogErrorText: '',
                    });

                    this.props.history.push(`questionaire/${type}/${selectedModel ? selectedModel.id : ''}/${guid}`);
                }
            })
            .catch(error => this.setState({
                inputGuidDialogErrorText: error.message,
            }));


    }

    public render() {

        const filterText = this.state.filterText;
        const filterEnabled = this.state.filterEnabled;
        const selectedModel = this.state.selectedModel;
        const isDialogHidden = this.state.isInputGuidDialogHidden;
        const dialogErrorText = this.state.inputGuidDialogErrorText;
        const dialogType = this.state.dialogType;

        const commands: IContextualMenuItem[] = [
            {
                key: 'new',
                name: 'New Questionaire',
                icon: 'Add',
                className: 'ms-CommandBarItem',
                onClick: () => this.props.history.push('questionaire/create'),
            },
            {
                key: 'fill',
                name: 'Fill',
                icon: 'IssueTracking',
                className: 'ms-CommandBarItem',
                disabled: selectedModel == null,
                onClick: () => window.open('questionaire/fill/' + (selectedModel ? selectedModel.id : '')),
            },
            {
                key: 'edit',
                name: 'Edit',
                icon: 'Edit',
                className: 'ms-CommandBarItem',
                disabled: selectedModel == null,
                onClick: this._prepareEditQuestionaire,
            },
            {
                key: 'report',
                name: 'Report',
                icon: 'CRMReport',
                className: 'ms-CommandBarItem',
                disabled: selectedModel == null,
                onClick: this._prepareViewQuestionaireReport,
            }
        ];

        const farCommands: IContextualMenuItem[] = [
            {
                key: 'filterEnabled',
                name: 'Filter State: ' + filterEnabled,
                icon: 'filter',
                className: 'ms-CommandBarItem',
                subMenuProps: {
                    items: [
                        {
                            key: 'All',
                            name: 'All',
                            canCheck: true,
                            isChecked: filterEnabled == 'All',
                            onClick: this._onToggleSelect,
                        },
                        {
                            key: 'Available',
                            name: 'Available',
                            canCheck: true,
                            isChecked: filterEnabled == 'Available',
                            onClick: this._onToggleSelect,
                        },
                        {
                            key: 'Stopped',
                            name: 'Stopped',
                            canCheck: true,
                            isChecked: filterEnabled == 'Stopped',
                            onClick: this._onToggleSelect,
                        }
                    ]
                }
            }
        ];

        return <div className='xhx-Page xhx-Questionaire'>
            <ThreeLevelBreadcrumb title='Questionaire' />

            <InputGuidDialog
                hidden={isDialogHidden}
                onDismiss={() => this.setState({ isInputGuidDialogHidden: true })}
                onConfirm={this._onFinishedInputGuid.bind(null, dialogType)}
                errorText={dialogErrorText}
            />

            <CommandBar
                ref={this._onBindSearchBox}
                isSearchBoxVisible={true}
                searchPlaceholderText='Filter by name or desc...'
                elipisisAriaLabel='More options'
                items={commands}
                farItems={farCommands}
            />

            <QuestionaireList
                filterText={filterText}
                filterEnabled={this._filterStatesMap[filterEnabled]}
                onReload={() => this.setState({
                    filterText: '',
                    filterEnabled: 'All',
                })}
                onSelected={this._onSelected}
            />
        </div>;
    }
}

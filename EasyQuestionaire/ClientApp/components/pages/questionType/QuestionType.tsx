import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { QuestionTypeList } from '../../parts/questionType/QuestionTypeList';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

import { TwoLevelBreadcrumb } from '../../parts/TwoLevelBreadcrumb';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';

export interface IQuestionTypeState {
    filterText: string,
    selectedModel: IQuestionTypeModel | null
}

export class QuestionType extends React.Component<RouteComponentProps<{}>, IQuestionTypeState> {

    private _selection: Selection;

    constructor() {
        super();

        this._onBindSearchBox = this._onBindSearchBox.bind(this);
        this._onSelected = this._onSelected.bind(this);

        this._selection = new Selection({
            onSelectionChanged: () => {
                let selectedModel: IQuestionTypeModel | null;
                if (this._selection.getSelectedCount() == 1) {
                    selectedModel = this._selection.getSelection()[0] as IQuestionTypeModel;
                } else {
                    selectedModel = null;
                }
                this.setState({
                    selectedModel: selectedModel
                });
            }
        });

        this.state = {
            filterText: '',
            selectedModel: null,
        }
    }

    private _onBindSearchBox(input: CommandBar | null) {
        if (input) {
            const pThis = this;
            (input.refs.searchSurface.firstChild as HTMLInputElement).onkeyup = function () {
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
                selectedModel: (selection.getSelection()[0] as IQuestionTypeModel)
            });
        } else {
            this.setState({
                selectedModel: null
            });
        }
    }

    public render() {

        const filterText = this.state.filterText;
        const selectedModel = this.state.selectedModel;

        const commands: IContextualMenuItem[] = [
            {
                key: 'new',
                name: 'New Question Type',
                icon: 'Add',
                className: 'ms-CommandBarItem',
                onClick: () => this.props.history.push('questionType/create'),
            },
            {
                key: 'view',
                name: 'View',
                icon: 'View',
                className: 'ms-CommandBarItem',
                disabled: selectedModel == null,
                onClick: () => this.props.history.push('questionType/view/' + (selectedModel ? selectedModel.id : '')),
            },
            {
                key: 'clone',
                name: 'Clone',
                icon: 'CloudDownload',
                className: 'ms-CommandBarItem',
                disabled: selectedModel == null,
                onClick: () => this.props.history.push('questionType/clone/' + (selectedModel ? selectedModel.id : '')),
            },
        ];

        return <div className='xhx-QuestionType'>

            <TwoLevelBreadcrumb title='Question Type' />

            <CommandBar
                ref={this._onBindSearchBox}
                isSearchBoxVisible={true}
                searchPlaceholderText='Filter by name...'
                elipisisAriaLabel='More options'
                items={commands}
            />

            <QuestionTypeList
                filterText={filterText}
                onReload={() => this.setState({
                    filterText: ''
                })}
                onSelected={this._onSelected}
            />
        </div>;
    }
}

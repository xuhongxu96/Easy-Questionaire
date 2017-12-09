import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { HasFetchComponent } from '../HasFetchComponent';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';

export interface ISelectQuestionTypeDialogProps {
    hidden: boolean,
    onDismiss: () => void,
    onSelected: (questionType: IQuestionTypeModel) => void,
    message: string,
}

export interface ISelectQuestionTypeDialogState {
    questionTypes: IQuestionTypeModel[],
    selectedType: IQuestionTypeModel | null,
    errorText: string,
}

export class SelectQuestionTypeDialog extends HasFetchComponent<ISelectQuestionTypeDialogProps, ISelectQuestionTypeDialogState> {
    constructor(props: ISelectQuestionTypeDialogProps) {
        super(props);

        this._onChanged = this._onChanged.bind(this);
        this._onConfirm = this._onConfirm.bind(this);
        this._onDismiss = this._onDismiss.bind(this);

        this.state = {
            questionTypes: [],
            selectedType: null,
            errorText: '',
        }
    }

    private _fetchQuestionTypes() {
        fetch('api/QuestionType')
            .then(response => response.json() as Promise<IQuestionTypeModel[]>)
            .then(data => {
                this.setStateWhenMount({
                    questionTypes: data,
                    selectedType: data.length > 0 ? data[0] : null,
                });
            })
            .catch(error => this.setStateWhenMount({ errorText: error.message }));
    }

    private _onChanged(option?: IComboBoxOption, index?: number, value?: string) {

        const questionTypes = this.state.questionTypes;

        if (index != undefined) {
            this.setState({
                selectedType: questionTypes[index]
            });
        } else {
            this.setState({
                selectedType: null
            });
        }
    }

    private _onConfirm() {
        const selectedType = this.state.selectedType;

        if (selectedType == null) {
            this.setState({
                errorText: 'Please select a question type.'
            });
        } else {
            this.props.onSelected(selectedType);
        }
    }

    private _onDismiss() {
        this.props.onDismiss();
    }

    componentDidMount() {
        super.componentDidMount();

        this._fetchQuestionTypes();
    }

    componentWillUpdate(nextProps: ISelectQuestionTypeDialogProps, nextState: ISelectQuestionTypeDialogState) {
        if (!nextProps.hidden && this.props.hidden) {
            const types = this.state.questionTypes;
            this.setState({
                selectedType: types.length > 0 ? types[0] : null,
                errorText: '',
            });
        }
    }

    render() {

        const selectedType = this.state.selectedType;
        const errorText = this.state.errorText;

        const options = this.state.questionTypes.map(o => {
            return {
                key: o.id,
                text: o.name,
            };
        });

        return (
            <Dialog
                hidden={this.props.hidden}
                onDismiss={this._onDismiss}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Select Question Type',
                    subText: this.props.message
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'ms-dialogMainOverride'
                }}
            >

                <ComboBox
                    label='Question Type:'
                    id='questionTypeComboBox'
                    ariaLabel='Question Type'
                    allowFreeform={false}
                    autoComplete='on'
                    options={options}
                    selectedKey={selectedType ? selectedType.id : ''}
                    onChanged={this._onChanged}
                    errorMessage={errorText}
                />

                <DialogFooter>
                    <PrimaryButton
                        onClick={this._onConfirm}
                        text='OK'
                    />

                    <DefaultButton onClick={this._onDismiss} text='Cancel' />
                </DialogFooter>

            </Dialog>
        );
    }
}
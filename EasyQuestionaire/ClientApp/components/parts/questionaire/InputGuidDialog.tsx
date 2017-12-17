import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ErrorBar } from '../ErrorBar';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';

export interface IInputGuidDialogProps {
    hidden: boolean,
    onDismiss: () => void,
    onConfirm: (guid: string) => void,
    errorText: string,
}

export interface IInputGuidDialogState {
    guid: string,
}

export class InputGuidDialog extends React.Component<IInputGuidDialogProps, IInputGuidDialogState> {
    constructor(props: IInputGuidDialogProps) {
        super(props);

        this.state = {
            guid: '',
        }
    }

    componentWillUpdate(nextProps: IInputGuidDialogProps, nextState: IInputGuidDialogState) {
        if (!nextProps.hidden && this.props.hidden) {
            this.setState({
                guid: '',
            });
        }
    }

    render() {

        const guid = this.state.guid;
        const errorText = this.props.errorText;

        return (
            <Dialog
                hidden={this.props.hidden}
                onDismiss={this.props.onDismiss}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Input GUID for Questionaire',
                    subText: 'Please input the GUID for this questionaire to acquire your edit permission.'
                }}
                modalProps={{
                    isBlocking: true,
                    containerClassName: 'ms-dialogMainOverride'
                }}
            >

                <TextField
                    value={guid}
                    onChanged={v => this.setState({ guid: v })}
                />

                {errorText != '' && <ErrorBar
                    errorText={errorText}
                />}

                <DialogFooter>
                    <PrimaryButton
                        onClick={() => { this.props.onConfirm(guid); }}
                        text='OK'
                    />

                    <DefaultButton onClick={this.props.onDismiss} text='Cancel' />
                </DialogFooter>

            </Dialog>
        );
    }
}
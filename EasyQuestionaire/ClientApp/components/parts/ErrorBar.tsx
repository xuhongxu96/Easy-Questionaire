import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IErrorBarProps {
    errorText?: string,
    onDismiss?: () => void,
}

export class ErrorBar extends React.Component<IErrorBarProps, {}> {

    constructor(props: IErrorBarProps) {
        super(props);
    }

    public render() {

        const errorText = this.props.errorText;

        return (
            <div className='xhx-ErrorBar'>
                {errorText && errorText != '' && <div className={'ms-slideDownIn10'}>
                    <MessageBar
                        messageBarType={MessageBarType.error}
                        isMultiline={false}
                        onDismiss={this.props.onDismiss}
                    >
                        {errorText}
                    </MessageBar>
                </div>}
            </div>
        );
    }
}

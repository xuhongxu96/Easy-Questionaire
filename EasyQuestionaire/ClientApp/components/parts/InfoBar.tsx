import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IInfoBarProps {
    infoText?: string,
    onDismiss?: () => void,
}

export class InfoBar extends React.Component<IInfoBarProps, {}> {

    constructor(props: IInfoBarProps) {
        super(props);
    }

    public render() {

        const infoText = this.props.infoText;

        return (
            <div className='xhx-InfoBar'>
                {infoText && infoText != '' && <div className={'ms-slideDownIn10'}>
                    <MessageBar
                        messageBarType={MessageBarType.info}
                        isMultiline={false}
                        onDismiss={this.props.onDismiss}
                    >
                        {infoText}
                    </MessageBar>
                </div>}
            </div>
        );
    }
}

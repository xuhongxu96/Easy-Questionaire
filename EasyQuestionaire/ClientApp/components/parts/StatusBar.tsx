import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IStatusBarProps {
    text: string,
    onDismiss?: () => void,
    status: MessageBarType,
    autoDismiss?: boolean,
}

export interface IStatusBarState {
    isHidden: boolean,
}

export class StatusBar extends React.Component<IStatusBarProps, IStatusBarState> {

    private _didMount = false;
    private _timeout: number | null = null;

    constructor(props: IStatusBarProps) {
        super(props);

        this.state = {
            isHidden: false,
        }
    }

    componentWillReceiveProps(nextProps: IStatusBarProps) {
        if (this._didMount) {
            this.setState({
                isHidden: false,
            });
        }
    }

    componentWillUpdate(nextProps: IStatusBarProps, nextState: IStatusBarState) {
        if (this._timeout != null) {
            clearTimeout(this._timeout);
        }
        if (nextProps.autoDismiss && this._didMount) {
            this._timeout = setTimeout(() => {
                this._timeout = null;
                if (this._didMount) {
                    this.setState({
                        isHidden: true,
                    });
                }
            }, 1000);
        }
    }

    componentDidMount() {
        this._didMount = true;
        this.setState({
            isHidden: true,
        });
    }

    componentWillUnmount() {
        this._didMount = false;
    }

    public render() {

        const text = this.props.text;
        const status = this.props.status;
        const isHidden = this.state.isHidden;

        return (
            <div className='xhx-StatusBar'>
                <div className={isHidden ? 'ms-slideUpOut10' : 'ms-slideDownIn10'}>
                    <MessageBar
                        messageBarType={status}
                        isMultiline={false}
                        onDismiss={this.props.onDismiss}
                    >
                        {text}
                    </MessageBar>
                </div>
            </div>
        );
    }
}

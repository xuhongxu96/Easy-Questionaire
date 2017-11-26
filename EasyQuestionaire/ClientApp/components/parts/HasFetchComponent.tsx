import * as React from 'react';

export class HasFetchComponent<P={}, S={}> extends React.Component<P, S> {

    protected _didMount = false;

    componentDidMount() {
        this._didMount = true;
    }

    componentWillUnmount() {
        this._didMount = false;
    }

    setStateWhenMount<K extends keyof S>(state: Pick<S, K>, callback?: () => any) {
        if (this._didMount) {
            this.setState(state);
        }
    }
}
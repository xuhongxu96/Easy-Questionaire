import * as React from 'react';
import {
    ICreateQuestionTypeComponentProps,
    IShowQuestionTypeComponentProps
} from '../components/parts/questionType/DynamicQuestionTypeComponent';

export interface IExampleQuestionTypeState {
    text: string,
}

export class ExampleQuestionType extends React.Component<ICreateQuestionTypeComponentProps, IExampleQuestionTypeState> {
    constructor(props: ICreateQuestionTypeComponentProps) {
        super(props);

        this._onValueChanged = this._onValueChanged.bind(this);

        this.state = {
            text: this.props.content,
        }
    }

    private _onValueChanged(event: any) {
        const content = event.target.value;
        this.setState({
            text: content,
        });
        this.props.onContentChanged(content);
    }

    public render() {

        const text = this.state.text;

        return (
            <div>
                <label>Please input something to show</label>
                <input type='text' value={text} onChange={this._onValueChanged} />
            </div>
        );
    }
}
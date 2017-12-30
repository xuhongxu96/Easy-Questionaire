import * as React from 'react';
import {
    ICreateQuestionTypeComponentProps,
    IShowQuestionTypeComponentProps
} from '../components/parts/questionType/DynamicQuestionTypeComponent';

export interface IExampleQuestionTypeState {
    text: string,
}

export class ExampleQuestionType extends React.Component<IShowQuestionTypeComponentProps, IExampleQuestionTypeState> {
    constructor(props: IShowQuestionTypeComponentProps) {
        super(props);

        this._onValueChanged = this._onValueChanged.bind(this);
        this._onSubmit = this._onSubmit.bind(this);

        this.state = {
            text: this.props.content,
        };
    }

    static getReportTitle() {
        return ['题型', '答案'];
    }

    static getReportRow(content: string) {
        return ['填空题', content];
    }

    private _onValueChanged(event: any) {
        const content = event.target.value;
        this.setState({
            text: content,
        });
    }

    private _onSubmit(event: any) {
        const content = this.state.text;
        this.props.onSubmit(content);
    }

    componentWillReceiveProps(nextProps: IShowQuestionTypeComponentProps) {
        const content = nextProps.content;

        this.setState({
            text: content,
        });
    }

    public render() {

        const text = this.state.text;

        return (
            <div>
                <label>{this.props.createContent}</label>
                <input type='text' value={text} onChange={this._onValueChanged} />
                <button onClick={this._onSubmit}>Submit</button>
            </div>
        );
    }
}
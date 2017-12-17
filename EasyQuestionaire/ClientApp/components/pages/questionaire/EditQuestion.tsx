import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { QuestionEditor } from '../../parts/questionaire/QuestionEditor';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';

export interface IEditQuestionProps {
    id: number,
    guid: string
}

export interface IEditQuestionState {
    model: IQuestionaireModel | null,
    errorText: string,
}

export class EditQuestion extends HasFetchComponent<RouteComponentProps<IEditQuestionProps>, IEditQuestionState> {

    constructor(props: RouteComponentProps<IEditQuestionProps>) {
        super(props);

        this.state = {
            model: null,
            errorText: '',
        };
    }

    private _fetchModel() {
        fetch('api/Questionaire/' + this.props.match.params.id)
            .then(response => response.json() as Promise<IQuestionaireModel>)
            .then(data => {
                this.setStateWhenMount({
                    model: data
                });
            })
            .catch(error => { this.setStateWhenMount({ errorText: error.message }); });
    }

    componentDidMount() {
        super.componentDidMount();
        this._fetchModel();
    }

    render() {

        const errorText = this.state.errorText;

        const model = this.state.model;
        const modelTitle = model ? model.title : this.props.match.params.id.toString();

        const guid = this.props.match.params.guid;

        return (<div className='xhx-Page xhx-EditQuestion'>
            <ThreeLevelBreadcrumb title='Questionaire' subtitle='Edit Questions' subsubtitle={modelTitle} history={this.props.history} url='/questionaire' />

            <ErrorBar
                errorText={errorText}
                onDismiss={() => this.setState({ errorText: '' })}
            />

            <Label>Please Always <span style={{ color: 'red' }}>Remember and Keep Secret</span> the GUID of Your Questionaire (which gives you edit permission): </Label>
            <TextField
                value={guid}
                underlined
                readOnly={true}
            />

            <hr />

            {model && <QuestionEditor
                model={model}
                guid={guid}
                onFinished={() => {
                    this.props.history.push('/questionaire');
                }}
            />
            }

        </div >);
    }


}

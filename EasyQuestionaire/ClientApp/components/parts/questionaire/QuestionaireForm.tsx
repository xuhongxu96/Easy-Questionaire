import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MonacoEditor from 'react-monaco-editor';
import { Promise } from 'es6-promise';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { ErrorBar } from '../ErrorBar';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import * as moment from 'moment';

export interface IQuestionaireFormError {
    Title?: string,
    Description?: string,
    StartDate?: string,
    EndDate?: string,
    OwnerIP?: string,
    guid?: string,
}

export interface IQuestionaireFormProps {
    type?: 'create' | 'edit' | 'view',
    model?: IQuestionaireModel,
    onSubmitted?: (questionaire: IQuestionaireModel) => void,
    guid?: string,
}

export interface IQuestionaireFormState {
    model: IQuestionaireModel,
    error: IQuestionaireFormError,
    isSubmitting: boolean,
}

export class QuestionaireForm extends HasFetchComponent<IQuestionaireFormProps, IQuestionaireFormState> {

    constructor(props: IQuestionaireFormProps) {
        super(props);

        this._onSubmit = this._onSubmit.bind(this);
        this._onModelChanged = this._onModelChanged.bind(this);
        this._getNameErrorMessagePromise = this._getNameErrorMessagePromise.bind(this);

        let initModel: IQuestionaireModel = {
            id: 0,
            ownerIP: '',
            title: '',
            description: '',
            startDate: new Date(),
            endDate: moment().add(1, "week").toDate(),
            isEnabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (this.props.model) {
            initModel = {
                ...this.props.model,
                updatedAt: new Date(),
            };
        }

        this.state = {
            model: initModel,
            error: {},
            isSubmitting: false,
        }
    }

    private _onSubmit() {

        if (this.props.type == 'view') return;

        this.setState({ isSubmitting: true });

        const model = this.state.model;

        const url = this.props.type == 'create' ? 'api/Questionaire' : `api/Questionaire/${model.id}/${this.props.guid}`;
        const method = this.props.type == 'create' ? 'POST' : 'PUT';

        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(model)
        })
            .then(response => {
                if (response.ok) {
                    alert("Successfully saved.");
                    (response.json() as Promise<IQuestionaireModel>).then(data => {
                        this.props.onSubmitted && this.props.onSubmitted(data);
                    });
                    return {};
                } else {
                    return response.json() as Promise<IQuestionaireFormError>
                }
            })
            .then(data => this.setStateWhenMount({ error: data, isSubmitting: false }))
            .then(() => scrollTo(0, 0))
            .catch(error => {
                console.log(error);
                scrollTo(0, 0);
                this.setStateWhenMount({ isSubmitting: false });
            });
    }

    private _onModelChanged(propName: string, value: any) {
        let model = { ...this.state.model };
        model[propName] = value;

        this.setState({
            model: model,
            error: {},
        });
    }

    private _getNameErrorMessagePromise(value: string) {
        return new Promise((resolve) => {
            value = value.trim().replace(/\//g, '-');
            if (value == '') {
                resolve('');
                return;
            }
            fetch('api/Questionaire/title/' + value)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => console.log(error));
        });
    }

    private _ExampleQuestionType: any;

    componentDidMount() {
        super.componentDidMount();
    }

    render() {

        const isOnlyView = this.props.type == 'view';
        const error = this.state.error;
        const { title, description, startDate, endDate } = this.state.model;

        return (
            <div className='xhx-QuestionaireForm'>
                <form>

                    {error.guid && <ErrorBar
                        errorText={error.guid}
                    />}
                    <TextField
                        label='Title'
                        value={title}
                        readOnly={isOnlyView}
                        onGetErrorMessage={this.props.type == 'create' ? this._getNameErrorMessagePromise : undefined}
                        onChanged={this._onModelChanged.bind(null, 'title')}
                        errorMessage={error.Title}
                    />

                    <TextField
                        multiline
                        rows={6}
                        label='Description'
                        value={description}
                        readOnly={isOnlyView}
                        onChanged={this._onModelChanged.bind(null, 'description')}
                        errorMessage={error.Description}
                    />

                    <Label> Start Date </Label>
                    <DatePicker
                        value={moment(startDate).toDate()}
                        onSelectDate={this._onModelChanged.bind(null, 'startDate')}
                        placeholder='Please select the start date of this questionaire...'
                    />

                    <Label> End Date </Label>
                    <DatePicker
                        value={moment(endDate).toDate()}
                        onSelectDate={this._onModelChanged.bind(null, 'endDate')}
                        placeholder='Please select the end date of this questionaire...'
                    />

                    {!isOnlyView && <PrimaryButton
                        className='xhx-LargeButton'
                        onClick={this._onSubmit}
                    > Save and Edit Questions </PrimaryButton>}

                </form>
            </div>
        );
    }
}
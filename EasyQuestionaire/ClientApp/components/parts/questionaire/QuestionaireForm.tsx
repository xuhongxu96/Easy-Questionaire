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
}

export interface IQuestionaireFormProps {
    isOnlyView?: boolean,
    model?: IQuestionaireModel,
    onSubmitted?: (id: number) => void,
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
                id: 0,
                ownerIP: '',
                createdAt: new Date(),
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

        if (this.props.isOnlyView) return;

        this.setState({ isSubmitting: true });

        const model = this.state.model;

        fetch('api/Questionaire', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(model)
        })
            .then(response => {
                if (response.ok) {
                    alert("Successfully created.");
                    (response.json() as Promise<IQuestionaireModel>).then(data => {
                        this.props.onSubmitted && this.props.onSubmitted(data.id);
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

        const isOnlyView = this.props.isOnlyView;
        const error = this.state.error;
        const { title, description, startDate, endDate } = this.state.model;

        return (
            <div className='xhx-QuestionaireForm'>
                <form>

                    <TextField
                        label='Title'
                        value={title}
                        readOnly={isOnlyView}
                        onGetErrorMessage={isOnlyView ? undefined : this._getNameErrorMessagePromise}
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
                        value={startDate}
                        onSelectDate={this._onModelChanged.bind(null, 'startDate')}
                        placeholder='Please select the start date of this questionaire...'
                    />

                    <Label> End Date </Label>
                    <DatePicker
                        value={endDate}
                        onSelectDate={this._onModelChanged.bind(null, 'endDate')}
                        placeholder='Please select the end date of this questionaire...'
                    />

                    {!isOnlyView && <PrimaryButton
                        className='xhx-LargeButton'
                        onClick={this._onSubmit}
                    > Save and Next </PrimaryButton>}

                </form>
            </div>
        );
    }
}
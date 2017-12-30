import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    IColumn,
    SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ThreeLevelBreadcrumb } from '../../parts/ThreeLevelBreadcrumb';
import { QuestionaireForm } from '../../parts/questionaire/QuestionaireForm';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { IQuestionModel } from '../../../models/IQuestionModel';
import { IAnswerModel } from '../../../models/IAnswerModel';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';
import { HasFetchComponent } from '../../parts/HasFetchComponent';
import { ErrorBar } from '../../parts/ErrorBar';
import { InfoBar } from '../../parts/InfoBar';

export interface IQuestionaireReportState {
    questions: IQuestionModel[],
    selectedQuestionId?: number,
    model: IQuestionaireModel | null,
    isLoading: boolean,
    errorText: string,
    reportTitle?: () => string[],
    reportItems?: (content: string) => string[],
    answers: IAnswerModel[],
    columns: IColumn[],
    reportContent: string,
}

export class QuestionaireReport extends HasFetchComponent<RouteComponentProps<{ id: number, guid: string }>, IQuestionaireReportState> {

    constructor(props: RouteComponentProps<{ id: number, guid: string }>) {
        super(props);

        this._onQuestionChanged = this._onQuestionChanged.bind(this);

        this.state = {
            questions: [],
            selectedQuestionId: undefined,
            model: null,
            isLoading: true,
            errorText: '',
            answers: [],
            columns: [],
            reportContent: '',
        }
    }

    private _fetchQuestions() {
        this.setState({ isLoading: true });

        fetch('api/Questionaire/questions/' + this.props.match.params.id)
            .then(response => response.json() as Promise<IQuestionModel[]>)
            .then(data => {
                this.setStateWhenMount({
                    questions: data,
                    selectedQuestionId: data.length > 0 ? data[0].id : undefined,
                    isLoading: false,
                });
                if (data.length > 0) {
                    this._loadQuestionType(0);
                }
            });
    }

    private _fetchModel() {
        const id = this.props.match.params.id;

        this.setState({ isLoading: true });

        fetch('api/questionaire/' + id)
            .then(response => response.json() as Promise<IQuestionaireModel>)
            .then(data => this.setStateWhenMount({
                model: data,
                isLoading: false
            }))
            .catch(error => this.setStateWhenMount({ errorText: error.message, isLoading: false }));
    }

    private _loadAnswers(question: IQuestionModel) {

        const id = this.props.match.params.id;
        const guid = this.props.match.params.guid;

        this.setState({ isLoading: true });

        fetch(`api/Questionaire/answers/${id}/${question.id}/${guid}`)
            .then(response => response.json())
            .then(data => {
                if (data['guid']) {
                    this.setStateWhenMount({
                        errorText: data['guid'],
                        isLoading: false,
                    });
                } else {
                    const { reportTitle, reportItems } = this.state;

                    let reportContent = '';
                    if (reportTitle && reportItems) {
                        reportContent = reportTitle().join('%2C') + '%0A';
                        (data as IAnswerModel[]).map(o => {
                            reportContent += reportItems(o.content).join('%2C') + '%0A';
                        })
                    }

                    this.setStateWhenMount({
                        answers: data,
                        isLoading: false,
                        reportContent: reportContent,
                    });
                }
            })
            .catch(error => this.setStateWhenMount({ errorText: error.message, isLoading: false }));
    }

    private _loadQuestionType(index: number) {

        const questions = this.state.questions;

        fetch('api/QuestionType/' + questions[index].typeId)
            .then(response => response.json() as Promise<IQuestionTypeModel>)
            .then(data => {
                let code = data.compiledShowForm;
                let requireComponent = eval(`(function (exports, React) {` + code + `})`);
                let context: any = {};
                requireComponent(context, React);

                const reportTitle: () => string[] = context.ExampleQuestionType.getReportTitle;
                const reportItems: (content: string) => string[] = context.ExampleQuestionType.getReportRow;

                const columns = reportTitle().map((str, index) => {
                    return {
                        key: str,
                        name: str,
                        fieldName: '',
                        minWidth: 100,
                        maxWidth: 200,
                        onRender: (item: IAnswerModel) => {
                            return (
                                <span>{reportItems(item.content)[index]}</span>
                            );
                        }
                    };
                });

                this.setStateWhenMount({
                    reportTitle: reportTitle,
                    reportItems: reportItems,
                    columns: columns,
                    isLoading: false,
                });
                this._loadAnswers(questions[index]);
            })
            .catch(error => this.setStateWhenMount({ errorText: error }));
    }

    private _onQuestionChanged(option: IComboBoxOption, index: number, value: string) {
        const questions = this.state.questions;

        this.setState({
            isLoading: true,
            selectedQuestionId: questions[index].id,
        });

        this._loadQuestionType(index);
    }

    componentDidMount() {
        super.componentDidMount();

        this._fetchModel();
        this._fetchQuestions();
    }

    render() {

        const model = this.state.model;
        const modelName = model ? model.title : this.props.match.params.id.toString();

        const errorText = this.state.errorText;
        const isLoading = this.state.isLoading;

        const questions = this.state.questions;
        const selectedQuestionId = this.state.selectedQuestionId;

        const reportContent = this.state.reportContent;

        let ReportList = null;

        if (this.state.reportTitle && this.state.reportItems) {
            const answers = this.state.answers;
            const reportTitle = this.state.reportTitle;
            const reportItems = this.state.reportItems;

            const columns = this.state.columns;

            ReportList = (<DetailsList
                className='xhx-QuestionaireReportList'
                items={answers}
                columns={columns}
                selectionMode={SelectionMode.single}
                setKey='questionaireReportList'
            />);
        }

        
        return (
            <div className='xhx-Page xhx-QuestionaireReport'>

                <ThreeLevelBreadcrumb
                    title='Questionaire'
                    subtitle='Report'
                    subsubtitle={modelName}
                    history={this.props.history}
                    url='/questionaire'
                />

                <ComboBox
                    options={questions.map(o => {
                        return {
                            key: o.id,
                            text: 'Question ' + (o.order + 1)
                        };
                    })}
                    selectedKey={selectedQuestionId}
                    label='Select Question'
                    onChanged={this._onQuestionChanged}
                />

                <PrimaryButton
                    text='Download'
                    href={'data:application/octet-stream,' + reportContent}
                />

                <ErrorBar
                    errorText={errorText}
                    onDismiss={() => this.setState({ errorText: '' })}
                />

                <InfoBar
                    infoText={isLoading ? 'Loading...' : ''}
                />

                {ReportList}

            </div>
        );
    }

}

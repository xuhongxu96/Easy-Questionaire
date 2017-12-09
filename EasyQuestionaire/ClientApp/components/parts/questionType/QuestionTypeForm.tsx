
/// <reference types="monaco-editor" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MonacoEditor from 'react-monaco-editor';
import { Promise } from 'es6-promise';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { IQuestionTypeModel } from '../../../models/IQuestionTypeModel';
import { ErrorBar } from '../ErrorBar';
import { HasFetchComponent } from '../../parts/HasFetchComponent';

export interface IQuestionTypeFormError {
    Name?: string,
    OwnerIP?: string,
    ShowFormTSX?: string,
    CreateFormTSX?: string,
}

export interface IQuestionTypeFormState {
    model: IQuestionTypeModel,
    error: IQuestionTypeFormError,
    isSubmitting: boolean,
}

export interface IQuestionTypeFormProps {
    model?: IQuestionTypeModel | null,
    isOnlyView?: boolean,
}

export class QuestionTypeForm extends HasFetchComponent<IQuestionTypeFormProps, IQuestionTypeFormState> {

    private _createFormEditorModel: any = null;
    private _showFormEditorModel: any = null;
    private _libDisposable: any = null;

    private _templateCode = `export class ExampleQuestionType extends React.Component<{}, {}> {
    constructor() {
        super();
    }

    public render() {
        return <div>Hello, World!</div>;
    }
}`;

    constructor(props: IQuestionTypeFormProps) {
        super(props)

        this._getNameErrorMessagePromise = this._getNameErrorMessagePromise.bind(this);
        this._onNameChanged = this._onNameChanged.bind(this);
        this._onCreateFormChanged = this._onCreateFormChanged.bind(this);
        this._onShowFormChanged = this._onShowFormChanged.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        // this._initEditor = this._initEditor.bind(this);

        let cloneModel: IQuestionTypeModel = {
            id: 0,
            name: '',
            createFormTSX: this._templateCode,
            showFormTSX: this._templateCode,
            compiledCreateForm: '',
            compiledShowForm: '',
            ownerIP: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (this.props.model) {
            cloneModel = {
                ...this.props.model,
                id: 0,
                ownerIP: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        this.state = {
            model: cloneModel,
            error: {},
            isSubmitting: false,
        }
    }

    private _getNameErrorMessagePromise(value: string) {
        return new Promise((resolve) => {
            value = value.trim().replace(/\//g, '-');
            if (value == '') {
                resolve('');
                return;
            }
            fetch('api/QuestionType/name/' + value)
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => console.log(error));
        });
    }

    private _onNameChanged(value: string) {
        const model = this.state.model;

        this.setState({
            model: {
                ...model,
                name: value,
            },
            error: {},
        });
    }

    private _onCreateFormChanged(value: string) {
        const model = this.state.model;

        this.setState({
            model: {
                ...model,
                createFormTSX: value
            },
            error: {},
        });
    }

    private _onShowFormChanged(value: string) {
        const model = this.state.model;

        this.setState({
            model: {
                ...model,
                showFormTSX: value
            },
            error: {},
        });
    }

    private _onSubmit() {

        if (this.props.isOnlyView) return;

        this.setState({ isSubmitting: true });

        const model = { ...this.state.model };
        const pThis = this;

        const createFormEditorModel = this._createFormEditorModel;
        const showFormEditorModel = this._showFormEditorModel;
        monaco.languages.typescript.getTypeScriptWorker()
            .then(function (worker: any) {
                worker(createFormEditorModel.uri)
                    .then(function (client: any) {
                        client.getEmitOutput(createFormEditorModel.uri.toString())
                            .then(function (res: any) {
                                model.compiledCreateForm = res.outputFiles[0].text;

                                monaco.languages.typescript.getTypeScriptWorker()
                                    .then(function (worker: any) {
                                        worker(showFormEditorModel.uri)
                                            .then(function (client: any) {
                                                client.getEmitOutput(showFormEditorModel.uri.toString())
                                                    .then(function (res: any) {
                                                        model.compiledShowForm = res.outputFiles[0].text;

                                                        fetch('api/QuestionType', {
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
                                                                    history.back();
                                                                    return {};
                                                                } else {
                                                                    return response.json() as Promise<IQuestionTypeFormError>
                                                                }
                                                            })
                                                            .then(data => pThis.setStateWhenMount({ error: data, isSubmitting: false }))
                                                            .then(() => scrollTo(0, 0))
                                                            .catch(error => {
                                                                console.log(error);
                                                                scrollTo(0, 0);
                                                                pThis.setStateWhenMount({ isSubmitting: false });
                                                            });
                                                    });
                                            });
                                    });

                            });
                    });
            });

    }

    private _initEditor() {

        const model = this.state.model;

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            declaration: false,
            target: monaco.languages.typescript.ScriptTarget.ES5,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            jsx: monaco.languages.typescript.JsxEmit.React,
            typeRoots: ["dist/monaco/@types/"]
        });

        fetch('dist/monaco/@types/react/index.d.ts')
            .then(response => response.text())
            .then(data => data.replace(`export = React;`, ``))
            .then(data => {
                if (!this._libDisposable) {
                    this._libDisposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(data, 'dist/monaco/@types/react/index.d.ts');
                }
            });

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false
        });

        if (!this._createFormEditorModel) {
            this._createFormEditorModel = monaco.editor.createModel(model.createFormTSX, 'typescript', monaco.Uri.parse('file:///create.tsx'))
        }

        if (!this._showFormEditorModel) {
            this._showFormEditorModel = monaco.editor.createModel(model.showFormTSX, 'typescript', monaco.Uri.parse('file:///show.tsx'))
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        if (this._libDisposable) {
            this._libDisposable.dispose();
            this._libDisposable = null;
        }

        if (this._createFormEditorModel) {
            this._createFormEditorModel.dispose();
            this._createFormEditorModel = null;
        }

        if (this._showFormEditorModel) {
            this._showFormEditorModel.dispose();
            this._showFormEditorModel = null;
        }
    }

    public render() {

        const name = this.state.model.name;
        const codeCreate = this.state.model.createFormTSX;
        const codeShow = this.state.model.showFormTSX;

        const error = this.state.error;
        const isSubmitting = this.state.isSubmitting;

        const isOnlyView = this.props.isOnlyView;

        const requireConfig = {
            url: 'dist/vs/loader.js',
            paths: {
                'vs': 'dist/vs',
            }
        };

        return (<div className='xhx-QuestionTypeForm'>
            <form>

                {isSubmitting && <Spinner label='Saving...' />}

                {!isOnlyView && !isSubmitting && <PrimaryButton
                    className='xhx-LargeButton'
                    onClick={this._onSubmit}
                > Save </PrimaryButton>}

                <TextField
                    label='Name'
                    value={name}
                    readOnly={isOnlyView}
                    onGetErrorMessage={isOnlyView ? undefined : this._getNameErrorMessagePromise}
                    onChanged={this._onNameChanged}
                    errorMessage={error.Name}
                />

                <Label> Create Form TSX </Label>

                <ErrorBar
                    errorText={error.CreateFormTSX}
                />

                <MonacoEditor
                    width="100%"
                    height="600"
                    language="typescript"
                    theme="vs-dark"
                    value={codeCreate}
                    options={{ readOnly: isOnlyView }}
                    requireConfig={requireConfig}
                    editorDidMount={(editor, monaco) => { this._initEditor(); editor.setModel(this._createFormEditorModel); }}
                    onChange={this._onCreateFormChanged}
                />

                <Label> Show Form TSX </Label>

                <ErrorBar
                    errorText={error.ShowFormTSX}
                />

                <MonacoEditor
                    width="100%"
                    height="600"
                    language="typescript"
                    theme="vs-dark"
                    value={codeShow}
                    options={{ readOnly: isOnlyView }}
                    requireConfig={requireConfig}
                    editorDidMount={(editor, monaco) => { this._initEditor(); editor.setModel(this._showFormEditorModel); }}
                    onChange={this._onShowFormChanged}
                />

                {isSubmitting && <Spinner className='xhx-BottomSpinner' label='Saving...' />}

                {!isOnlyView && !isSubmitting && <PrimaryButton
                    className='xhx-LargeButton'
                    onClick={this._onSubmit}
                > Save </PrimaryButton>}

            </form>
        </div>);
    }
}

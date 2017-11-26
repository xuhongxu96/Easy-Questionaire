import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MonacoEditor from 'react-monaco-editor';
import { Promise } from 'es6-promise';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
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
}

export interface IQuestionTypeFormProps {
    model?: IQuestionTypeModel | null,
    isOnlyView?: boolean,
}

export class QuestionTypeForm extends HasFetchComponent<IQuestionTypeFormProps, IQuestionTypeFormState> {

    private readonly _defaultError: IQuestionTypeFormError = {
        Name: '',
        OwnerIP: '',
        ShowFormTSX: '',
        CreateFormTSX: '',
    };

    constructor(props: IQuestionTypeFormProps) {
        super(props)

        this._getNameErrorMessagePromise = this._getNameErrorMessagePromise.bind(this);
        this._onNameChanged = this._onNameChanged.bind(this);
        this._onCreateFormChanged = this._onCreateFormChanged.bind(this);
        this._onShowFormChanged = this._onShowFormChanged.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onCodeEditorDidMount = this._onCodeEditorDidMount.bind(this);

        const templateCode = `export class ExampleQuestionType extends React.Component<{}, {}> {
    constructor() {
        super();
    }

    public render() {
        return <div>Hello, World!</div>;
    }
}`;

        let cloneModel = {
            id: 0,
            name: '',
            createFormTSX: templateCode,
            showFormTSX: templateCode,
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
            error: this._defaultError,
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
                name: value
            },
            error: this._defaultError,
        });
    }

    private _onCreateFormChanged(value: string) {
        const model = this.state.model;

        this.setState({
            model: {
                ...model,
                createFormTSX: value
            },
            error: this._defaultError,
        });
    }

    private _onShowFormChanged(value: string) {
        const model = this.state.model;

        this.setState({
            model: {
                ...model,
                showFormTSX: value
            },
            error: this._defaultError,
        });
    }

    private _onSubmit() {
        if (this.props.isOnlyView) return;

        const model = this.state.model;

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
                    return this._defaultError;
                } else {
                    return response.json() as Promise<IQuestionTypeFormError>
                }
            })
            .then(data => this.setStateWhenMount({ error: data }))
            .then(() => scrollTo(0, 0))
            .catch(error => {
                console.log(error);
                scrollTo(0, 0);
            });
    }

    private _editorModel: any = null;
    private _libDisposable: any = null;

    private _onCodeEditorDidMount(editor: any, monaco: any) {
        if (!this._editorModel) {

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                declaration: false,
                target: monaco.languages.typescript.ScriptTarget.ES5,
                allowNonTsExtensions: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.CommonJS,
                jsx: 'react',
                typeRoots: ["dist/monaco/@types/"]
            });

            fetch('dist/monaco/@types/react/index.d.ts')
                .then(response => response.text())
                .then(data => data.replace(`export = React;`, ``))
                .then(data => {
                    this._libDisposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(data, 'dist/monaco/@types/react/index.d.ts');
                });

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false
            });

            this._editorModel = monaco.editor.createModel(editor.getValue(), 'typescript', monaco.Uri.parse('file:///main.tsx'))

        }

        editor.setModel(this._editorModel);
        editor.focus();
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        if (this._libDisposable) {
            this._libDisposable.dispose();
            this._libDisposable = null;
        }

        if (this._editorModel) {
            this._editorModel.dispose();
            this._editorModel = null;
        }
    }

    public render() {

        const name = this.state.model.name;
        const codeCreate = this.state.model.createFormTSX;
        const codeShow = this.state.model.showFormTSX;

        const error = this.state.error;

        const isOnlyView = this.props.isOnlyView;

        const requireConfig = {
            url: 'dist/vs/loader.js',
            paths: {
                'vs': 'dist/vs',
            }
        };

        return (<div className='xhx-QuestionTypeForm'>
            <form>
                {!isOnlyView && <PrimaryButton
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
                    editorDidMount={this._onCodeEditorDidMount}
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
                    editorDidMount={this._onCodeEditorDidMount}
                    onChange={this._onShowFormChanged}
                />

                {!isOnlyView && <PrimaryButton
                    className='xhx-LargeButton'
                    onClick={this._onSubmit}
                > Save </PrimaryButton>}

            </form>
        </div>);
    }
}

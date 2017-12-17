# Easy Questionaire

Very Easy Questionaire System.

Enable users to design their own question types. (Users can write components extends `React.Component`)

## Concepts

### No Authentication

No registered users as well as logined users.

Everything is open to everyone.

Feel free to upload new question type and new questionaire.

Feel free to answer questionaire.

### Guid for Editing Questionaire

To avoid your questionaire being destroyed by others, Easy Questionaire use the unique Guid to identify your permission to the questionaire.

Only if you provide the right Guid for the questionaire, you are allowed to edit it.

### Custom Question Type

Users should define 2 components for a new Question Type:

- A component for creating question of the new question type (for questionaire maker)  
- A component for showing question of the new question type (for questionaire reader/answerer)

#### Interface for creating (Alpha Version...)

``` typescript

interface ICreateQuestionTypeComponentProps {
	question: IQuestionModel,
	questions: IQuestionModel[],
	content: string, // save settings in [content]
	onContentChanged: (content: string) => void,
}

```

#### Interface for showing (Alpha Version...)

``` typescript

interface IShowQuestionTypeComponentProps {
	question: IQuestionModel,
	questions: IQuestionModel[],
	answers: IAnswerModel[],
	createContent: string, // [ICreateQuestionTypeComponentProps.content] settings of the component
	content: string, // save answer in [content]
	onSubmit: (content: string, nextQuestionIndex?: number) => void,
	
}

```

## Roadmap

- [x] Question Type List
- [x] Question Type Component Editor (Using monaco-editor)
- [x] Question Type Creating and Editing Form
- [x] Questionaire List
- [x] Questionaire Creating Form
- [x] Questionaire Question Editor
	- [x] Add Question
	- [x] Remove Question
	- [x] Re-order Question
	- [x] Save questions
- [x] Questionaire Editing Form
- [ ] Questionaire Filling Form
- [ ] Questionaire Report

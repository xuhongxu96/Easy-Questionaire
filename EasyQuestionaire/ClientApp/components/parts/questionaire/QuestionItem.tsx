import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CommandBarButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IQuestionaireModel } from '../../../models/IQuestionaireModel';
import { IQuestionModel } from '../../../models/IQuestionModel';
import { HasFetchComponent } from '../HasFetchComponent';
import { DynamicQuestionTypeComponent } from '../questionType/DynamicQuestionTypeComponent'
import { ErrorBar } from '../ErrorBar';
import { InfoBar } from '../InfoBar';

export interface IQuestionItemProps {
    question: IQuestionModel,
    questions: IQuestionModel[],
    onRemove: (index: number) => void,
    onInsert: (index: number) => void,
    onMove: (index:number, target: number) => void,
}

export class QuestionItem extends React.Component<IQuestionItemProps, {}> {

    constructor(props: IQuestionItemProps) {
        super(props);
    }

    render() {

        const question = this.props.question;
        const questions = this.props.questions;

        return (
            <div className='xhx-QuestionItem'>

                <div className='xhx-CommandBarButton-Container'>
                    <CommandBarButton
                        iconProps={{ iconName: 'ChevronUp' }}
                        text='Insert New Question Before'
                        onClick={() => this.props.onInsert(question.order)}
                    />

                    <CommandBarButton
                        iconProps={{ iconName: 'DoubleChevronUp' }}
                        text='Move Up'
                        disabled={question.order == 0}
                        onClick={() => this.props.onMove(question.order, question.order - 1)}
                    />
                </div>

                <div className='xhx-QuestionItem-Content'>

                    <Label>Question {question.order + 1}</Label>

                    <DynamicQuestionTypeComponent
                        questionTypeId={question.typeId}
                        formType='create'
                    />

                </div>
                <div className='xhx-CommandBarButton-Container'>
                    <CommandBarButton
                        iconProps={{ iconName: 'ChevronDown' }}
                        text='Append New Question After'
                        onClick={() => this.props.onInsert(question.order + 1)}
                    />

                    <CommandBarButton
                        iconProps={{ iconName: 'DoubleChevronDown' }}
                        text='Move Down'
                        disabled={question.order == questions.length - 1}
                        onClick={() => this.props.onMove(question.order, question.order + 1)}
                    />

                    <CommandBarButton
                        style={{ marginLeft: 'auto' }}
                        iconProps={{ iconName: 'Remove' }}
                        text='Remove'
                        onClick={() => this.props.onRemove(question.order)}
                    />
                </div>
            </div>
        );
    }

}
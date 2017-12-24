import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/parts/Layout';
import { Home } from './components/pages/Home';
import { Questionaire } from './components/pages/questionaire/Questionaire'
import { CreateQuestionaire } from './components/pages/questionaire/CreateQuestionaire'
import { EditQuestionaire } from './components/pages/questionaire/EditQuestionaire'
import { EditQuestion } from './components/pages/questionaire/EditQuestion'
import { FillQuestionaire } from './components/pages/questionaire/FillQuestionaire'
import { QuestionType } from './components/pages/questionType/QuestionType'
import { CreateQuestionType } from './components/pages/questionType/CreateQuestionType'
import { CloneQuestionType } from './components/pages/questionType/CloneQuestionType'
import { ViewQuestionType } from './components/pages/questionType/ViewQuestionType'

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/questionaire' component={Questionaire} />
    <Route exact path='/questionaire/create' component={CreateQuestionaire} />
    <Route exact path='/questionaire/edit/:id/:guid' component={EditQuestionaire} />
    <Route exact path='/questionaire/edit/questions/:id/:guid' component={EditQuestion} />
    <Route exact path='/questionaire/fill/:id' component={FillQuestionaire} />
    <Route exact path='/questionType' component={QuestionType} />
    <Route exact path='/questionType/create' component={CreateQuestionType} />
    <Route exact path='/questionType/view/:id' component={ViewQuestionType} />
    <Route exact path='/questionType/clone/:id' component={CloneQuestionType} />
</Layout>;

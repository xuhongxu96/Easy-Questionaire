import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/parts/Layout';
import { Home } from './components/pages/Home';
import { Questionaire } from './components/pages/Questionaire'
import { QuestionType } from './components/pages/questionType/QuestionType'
import { CreateQuestionType } from './components/pages/questionType/CreateQuestionType'
import { CloneQuestionType } from './components/pages/questionType/CloneQuestionType'
import { ViewQuestionType } from './components/pages/questionType/ViewQuestionType'

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/questionaire' component={Questionaire} />
    <Route exact path='/questionType' component={QuestionType} />
    <Route exact path='/questionType/create' component={CreateQuestionType} />
    <Route exact path='/questionType/view/:id' component={ViewQuestionType} />
    <Route exact path='/questionType/clone/:id' component={CloneQuestionType} />
</Layout>;

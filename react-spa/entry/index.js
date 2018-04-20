/**
 * Created by lxf on 2016-8-30.
 * 入口
 */

import React from 'react';
import {render} from 'react-dom';
import App from '../modules/app';
import Home from '../modules/home/home';
import CategoryList from '../modules/category-list/category-list';
import DetailPage from '../modules/detail-page/detail-page';
import Repos from '../modules/repos';
import Repo from '../modules/repo';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import  '../css/page/_index.scss';

// const CourseRoute = {
//     path: '/repos',
//
//     getChildRoutes(partialNextState, callback) {
//         require.ensure([], function (require) {
//             callback(null, [
//                 require('./routes/Announcements'),
//                 require('./routes/Assignments'),
//                 require('./routes/Grades'),
//             ])
//         })
//     },
//
//     getIndexRoute(partialNextState, callback) {
//         require.ensure([], function (require) {
//             callback(null, {
//                 component: require('./components/Index'),
//             })
//         })
//     },
//
//     getComponents(nextState, callback) {
//         require.ensure([], function (require) {
//             callback(null, require('./components/Course'))
//         })
//     }
// };

//普通方式
// render(
//     <Router history={hashHistory}>
//         <Route path="/" component={App}>
//             <IndexRoute component={Home}/>
//             <Route path="/repos" component={Repos}>
//                 <Route path="/repos/:repoName" component={Repo}/>
//             </Route>
//             <Route path="/category-list" component={CategoryList}/>
//             <Route path="/detail-page" component={DetailPage} />
//         </Route>
//     </Router>,
//     document.getElementById('container')
// );

//高级方式
const routes = {
    path: '/',
    component: App,
    indexRoute: {component: Home},
    childRoutes: [
        {
            path: '/repos',
            component: Repos,
            childRoutes: [{
                path: '/repos/:repoName',
                component: Repo,
                // onEnter: ({ params }, replace) => replace(`/repos/${params.repoName}`)
                onEnter: ((a, b)=> {
                    console.info(a);
                    console.info(b);
                })
            }]
        },
        {
            path: '/category-list',
            component: CategoryList,
        },
        {
            path: '/detail-page',
            component: DetailPage,
        }
    ]
};

render(<Router history={hashHistory} routes={routes}/>, document.getElementById('container'));
/**
 * Created by 刘晓帆 on 2016-4-11.
 * 首页
 */
'use strict';
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
// import routes and pass them into <Router/>
import routes from '../modules/routers'

render(
    <Router routes={routes} history={browserHistory}/>,
    document.getElementById('app')
)





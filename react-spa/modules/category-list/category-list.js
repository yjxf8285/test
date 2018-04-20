/**
 * Created by lxf on 2016-8-31.
 * 列表页
 */
import React from 'react';
import NavLink from '../../modules/nav-link';
class CategoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>列表页</h1>
                <ul>
                    <li><NavLink to="/detail-page?id=1">1</NavLink></li>
                    <li><NavLink to="/detail-page?id=2">2</NavLink></li>
                    <li><NavLink to="/detail-page?id=3">3</NavLink></li>
                </ul>
            </div>
        )
    }
}
console.info('load list');
export default CategoryList;
/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import VizG from '../../src/VizG';
import { makeDataWithSize } from './util/MakeData';

const totalPages = (Math.random() * 100).toFixed(0);

const requestData = (pageSize, page) => {
    // This is a mock service to emulate an endpoint you can use any kind of endpoint to fetch data.
    return new Promise((resolve, reject) => {
        const res = {
            data: makeDataWithSize(pageSize),
            pages: totalPages,
        };

        setTimeout(() => resolve(res), 500);
    });
}

export default class ServerSidePaginationTableChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pageSize: -1,
        };

        this.normalTableConfig = {
            charts: [
                {
                    type: 'table',
                    columns: [
                        {
                            name: 'firstName',
                            title: 'First Name',
                        },
                        {
                            name: 'lastName',
                            title: 'Last Name',
                        },
                        {
                            name: 'age',
                            title: 'Age',
                        },
                        {
                            name: 'visits',
                            title: 'Visits',
                        },
                        {
                            name: 'status',
                            title: 'status',
                        },
                    ],
                },
            ],
            pagination: true,
            filterable: true,
            append: false,
            sortable: false
        };

        this.normalDataSetMetadata = {
            names: ['firstName', 'lastName', 'age', 'visits', 'status'],
            types: ['ordinal', 'ordinal', 'linear', 'linear', 'linear'],
        };
    }

    render() {
        return (
            <VizG
                config={this.normalTableConfig}
                metadata={this.normalDataSetMetadata}
                data={this.state.data}
                manual
                pages={this.state.pageSize}
                onFetchData={(state) => {
                    requestData(state.pageSize, state.page)
                        .then((res) => {
                            this.setState({
                                data: res.data,
                                pageSize: res.pages,
                            });
                        });
                }}
                theme={this.props.theme}
            />
        );
    }

}

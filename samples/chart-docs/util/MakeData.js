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

import Namor from 'namor';

const range = (len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = () => {
    const statusChance = Math.random();
    return [
        Namor.generate({ words: 1, numbers: 0 }),
        Namor.generate({ words: 1, numbers: 0 }),
        Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        statusChance > 0.66
            ? 'relationship'
            : statusChance > 0.33 ? 'complicated' : 'single',
    ];
};

export function makeData() {
    const dataSet = [];

    for (let i = 0; i < 100 ; i++) {
        dataSet.push(newPerson());
    }

    return dataSet;
}

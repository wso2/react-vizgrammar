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
import { Card, CardHeader, CardContent, AppBar, Toolbar, Typography, Button, IconButton } from 'material-ui';
import Remarkable from 'remarkable';
import hljs from 'highlight.js';
import { Link } from 'react-router-dom';
import ReadMe from './GettingStarted.md';
import SimpleChart from './chart-docs/SimpleChart';
import GitHub from './components/GitHub';


export default class GettingStarted extends React.Component {
    render() {
        const md = new Remarkable('full', {
            html: false,        // Enable HTML tags in source
            xhtmlOut: false,        // Use '/' to close single tags (<br />)
            breaks: false,        // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',  // CSS language prefix for fenced blocks
            linkify: true,         // autoconvert URL-like texts to links
            linkTarget: '',           // set target to open link in

            // Enable some language-neutral replacements + quotes beautification
            typographer: false,

            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
            quotes: '“”‘’',

            // Highlighter function. Should return escaped HTML,
            // or '' if input not changed
            highlight(str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (__) {}
                }

                try {
                    return hljs.highlightAuto(str).value;
                } catch (__) {}

                return ''; // use external default escaping
            },
        });
        return (
            <div>
                <AppBar>
                    <Toolbar >
                        <Typography type="title" color="inherit" style={{ flex: 1 }}>
                            React-VizGrammar
                        </Typography>
                        <Link to={'/'} style={{ textDecoration: 'none' }}>
                            <Button style={{ color: '#fff' }}>
                                Samples
                            </Button>
                        </Link>

                        <IconButton
                            color="inherit"
                            onClick={() => { window.location.href = 'https://github.com/wso2/react-vizgrammar'; }}
                            title="See the source on GitHub"
                        >
                            <GitHub />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Card style={{ marginTop: 80, marginLeft: 400, marginRight: 400 }} >
                    <CardContent>

                        <div dangerouslySetInnerHTML={{ __html: md.render(ReadMe) }} />
                        <SimpleChart />

                    </CardContent>
                </Card>
            </div>
        );
    }
}

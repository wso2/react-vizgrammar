# Getting started....

React VizGrammar is a wrapper around Victory JS and it makes charting easier by adding boilerplate code so that 
designers and developers can get started and set it up in a few minutes.

First start by installing the react-vizgrammar dependency into your project by running the command,

```bash
    npm i -S react-vizgrammar
``` 

A chart can be embedded in a React environment simply by importing the VizG component and embedding it in the render 
method of a component.
```jsx
    import VizG from 'react-vizgrammar';

    class RandomComponent extends React.Component {
        // component logic
        
        render() {
            return (
                <VizG config={config} data={data} metadata={metadata} />
            );
        }
    }
``` 
where the props
- `config` is the widget configurations specified as a JSON object.
- `data` is the array of data sets fed to the charts.
- `metadata` is the JSON object that contains information about the provided dataset.

### Chart `config` prop
Users have to provide parameters for the widget using config object inorder to create the chart type they require. It is a JSON object that has a well defined configuration attributes to customize the chart.

Following is a basic configuration to plot a line chart,
```javascript
    let config = {
        x : "rpm",
        charts : [{type: "line",  y : "torque", color: "EngineType"}],
        maxLength: 10,
        width: 400,
        height: 200
    }
```
These configuration and how it varies for different charts can be found in the charting samples [here](/#/samples).
### `metadata` prop and `data` prop
Once the `config` is provided. User can provide a dataset to visualize the chart. For easy interpretation React-VizGrammar require this dataset to be arranged in a tabular way similar to the way explained below.
```javascript
    metadata = {
        "names": ["Column1", "Column2",...],
        "types": ['ordinal', 'linear',...]
    };
```

`metadata.names` is an array consists of column names/fields of the table and `metadata.types` contains their types 
(ordinal, time or linear), `names` and `types` are aligned together in a way that "Column1" => 'ordinal' and "Column2" => 'linear' and so on.

```javascript
    data = [
        ["value1", numericValue1,...],
        ["value2", numericValue2,...],
    ];
```
`data` collection of arrays of data rows. Single row is stored as an array and their element order follows the order of `metadata.names`.

Sample data table would be like following:
```javascript
    metadata = {
        "names" : ["rpm","torque","horsepower", "EngineType"],
        "types" : ["linear","linear", "ordinal","ordinal"]
    };

    data = [
        [8000, 75, 120, "Piston"],
        [9000, 81, 130, "Rotary"]
    ];
```

### Events
React VizGrammar supports `onClick` events, to use the onClick events user has to submit a function to the `onClick` prop of the react component.

```jsx
    <VizG config={config} data={data} metadata={metadata} onClick={(data) => { /* function to perform */ }} />
```

The submitted function should have a parameter if user wishes to retrieve the data related to the data point.

### Themes

React VizGrammar has light and dark theme types to choose from. By default, charts use the light theme type.

```jsx
    
    <VizG theme={'dark'} config={config} data={data} metadata={metadata} />
            
``` 

- `theme` prop accepts 'light' and 'dark' strings as type and change the theme accordingly.

## Sample in action

Code :
```jsx
    import React from 'react';
    import VizG from 'react-vizgrammar';
    
    export default class SimpleChart extends React.Component {
    
        constructor(props) {
            super(props);
    
            this.lineChartConfig = {
                x: 'rpm',
                charts: [{ type: 'line', y: 'torque' }],
                maxLength: 30,
                width: 800,
                height: 400,
                interactiveLegend: true,
                legend: true,
            };
    
            this.metadata = {
                names: ['rpm', 'torque', 'horsepower', 'EngineType'],
                types: ['linear', 'linear', 'ordinal', 'ordinal'],
            };
    
            this.staticDataSet = [
                [10, 11, 12, 'piston'],
                [11, 15, 12, 'rotary'],
                [12, 14, 12, 'piston'],
                [13, 24, 12, 'rotary'],
                [15, 11, 12, 'rotary'],
                [16, 15, 12, 'piston'],
                [17, 14, 12, 'rotary'],
            ];
        }
    
    
        render() {
            return (
                <VizG config={this.lineChartConfig} metadata={this.metadata} data={this.staticDataSet}/>
            );
        }
    }

```

Output :

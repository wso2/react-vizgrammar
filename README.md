# React-VizGrammar

React VizGrammar is a wrapper around Victory JS it makes charting easier by adding boilerplate code so that designers and developers can start in a few minutes.

A chart can be embedded in a React environment simply by using the VizG react component.
```javascript
    <VizG config={config} data={data} metadata={metadata} >
``` 
where the props
- config is the gadget configurations specified as a JSON object.
- data is the array of data sets fed to the charts.
- metadata is the JSON object that contains information about the provided dataset.

## Build Process
To manually build React-VizGrammar you Node.js and npm installed in the PC. then navigate to the cloned directory and run,
```bash
    npm install
```

In order to build and run the samples navigate to the samples directory in the main directory and run,
```bash
    npm run
    npm run samples
```

## Data table
React VizGrammar required you to arrange your source dataset in a tabular way similar to follwing format.
```javascript
	metadata = {
	  "names":["Column1","Column2",...],
	  "types":['ordinal', 'linear',]
	};
	data = [
	  ["value1",numericValue1,...],
	  ["value2",numericValue2,...],
	];
}
```

Sample data table would be like following:
```javascript
    metadata = {
            "names" : ["rpm","torque","horsepower", "EngineType"],
            "types" : ["linear","linear", "ordinal","ordinal"]
    };
    data = [
          [8000, 75, 120, "Piston"], [9000, 81, 130, "Rotary"]]
    ];
```


metadata.names is an array consists of column names/fields of the table where metadata.types records their types (ordinal (C) or linear).
names and types are aligned together in a way that "Coulmn1" => 'ordinal' and "Coulmn2" => 'linear' and so on.

data section is a collection of arrays of data rows. Single row is stored as an array and their element order follows the order of metadata.names.

##Chart Config

Once the data structure is ready, React VizGrammar will try to render a chart out of it.

Users has to give additional parameters to the gadget using config object. It is a JSON object that has well known configuration properties. For example, User can plot a bar chart by simply giving the chart type in the object as 'bar' in the configuration

E.g Following is the bare minimum set of configurations require to draw a bar chart from above tabular data format.
```javascript
let config = {
    x : "rpm",
    charts : [{type: "line",  y : "torque", color: "EngineType"}],
    maxLength: 10,
    width: 400,
    height: 200
}
```

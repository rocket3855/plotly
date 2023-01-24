function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
   
    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter((sampleObj) => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var results = resultArray[0];

    console.log(data);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids.slice(0, 10).reverse();
    var otu_labels = results.otu_labels.slice(0, 10).reverse();
    var sample_values = results.sample_values.slice(0, 10).reverse();

    // log variables
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last.
    var yticks = otu_ids.map((value) => 'OTU ' + value);

    console.log(yticks);


    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values,
      y: yticks,
      text: otu_labels,
      type: 'bar',
      orientation: 'h',
    };

    var data = [trace];

    // 9. Create the layout for the bar chart.
    var layout = {
      title: { 
        text: '<b>Most Cultures Found</b>', 
        size: 18
       },
       xaxis: {
        title: {
          text: 'cultures found',
        },
      },
      yaxis: {
        title: {
          text: 'Top OTU ID',
        },
      },
      paper_bgcolor: 'grey',

    };
    
    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', data, layout);


    // Deliverable 2: 1. Create the trace for the bubble chart.
    otu_ids = results.otu_ids;
    otu_labels = results.otu_labels;
    sample_values = results.sample_values;

    var bTrace = {
      x: otu_ids, 
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'YlOrRd',
        size: sample_values.map((num) => num * 0.9),
      },
    };

    var bData = [bTrace];

     // Deliverable 2: 2. Create the layout for the bubble chart.
     var bLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
      yaxis: {
        title: {
          text: 'OTU ID range',
        },
      },

    };

    
   
   
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bData, bLayout);



     // 1. Create a variable that filters the metadata array for the object with the desired sample number.
     var metadata = data.metadata;
     // Filter the data for the object with the desired sample number
     let rArray = metadata.filter((sampleObj) => sampleObj.id == sample);
 
     // Create a variable that holds the first sample in the array.
     // Use the 'result' variable that was set in D1.
 
     // 2. Create a variable that holds the first sample in the metadata array.
     var metadata =rArray[0];
 
     // Create variables that hold the otu_ids, otu_labels, and sample_values.
     // Use the variables that were reset in D2 to hold all the sample data for the first volunteer.
 
     // 3. Create a variable that holds the washing frequency.
     wfrequency = parseFloat(metadata.wfrequency);
     console.log(wfrequency);
 
     // Create the yticks for the bar chart.
     // See D2 above for this code.
 
     // 4. Create the trace for the gauge chart.
     var guageTrace = {
       value: wfrequency,
       title: { text: '<b>washed belly buttons per week</b><br>'},
       type: 'indicator',
       mode: 'gauge+number',
       gauge: {
         axis: { range: [null, 10], tickcolor: 'black' },
         steps: [
          { range: [0, 2], color: 'green' },
          { range: [2, 4], color: 'darkgreen' },
          { range: [4, 6], color: 'yellow' },
          { range: [6, 8], color: 'orange' },
          { range: [8, 10], color: 'red' },
          ],
         bordercolor: 'black',
         threshold: {
          line: {color: "red", width: 4},
          thickness: 0.75,
          value: 10
         }
         
       },
     };
 
     var gaugeData = [guageTrace];
 
     // 5. Create the layout for the gauge chart.
     var glayout = {
      width: 400,
      height: 250,
      margin: { t: 0, b: 0 },
      };
 
     // 6. Use Plotly to plot the gauge data and layout.
     Plotly.newPlot('gauge', gaugeData, glayout);
  });
}

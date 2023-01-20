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
    let custom_font = { color: 'darkblue', family: 'Arial', size: 14 };


    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter((sampleObj) => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    console.log(data);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids.slice(0, 10).reverse();
    var otu_labels = result.otu_labels.slice(0, 10).reverse();
    var sample_values = result.sample_values.slice(0, 10).reverse();

    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last.
    var yticks = otu_ids.map((value) => 'OTU ' + value);

    console.log(yticks);


    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barTrace = {
      x: sample_values,
      y: yticks,
      text: otu_labels,
      type: 'bar',
      orientation: 'h',
    };

    var barData = [barTrace];

    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: { text: '<b>Top 10 Bacteria Cultures Found</b>', size: 20 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: custom_font,
    };
    
    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);


    // Deliverable 2: 1. Create the trace for the bubble chart.
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values = result.sample_values;

    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values.map((num) => num * 0.7),
      },
    };

    var bData = [bubbleTrace];

     // Deliverable 2: 2. Create the layout for the bubble chart.
     var bLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      paper_bgcolor: 'rgba(0,0,0,0)',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
      font: custom_font,
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bData, bLayout);



    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter((sampleObj) => sampleObj.id == sample);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var metadata1 = metadataArray[0];
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    washingfreq = parseFloat(metadata1.wfreq);
    console.log(wfreq);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var guageTrace = {
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {
        text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
      },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: 'black' },
        bar: { color: 'black' },
        borderwidth: 2,
        bordercolor: 'black',
        steps: [
          { range: [0, 2], color: 'red' },
          { range: [2, 4], color: 'orange' },
          { range: [4, 6], color: 'yellow' },
          { range: [6, 8], color: 'lightgreen' },
          { range: [8, 10], color: 'green' },
        ],
      },
    };

    var gaugeData = [guageTrace];
    // Deliverable 3: 5. Create the layout for the gauge chart.
        var gaugeLayout = {
      width: 500,
      height: 350,
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 100, b: 0 },
      font: custom_font,
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

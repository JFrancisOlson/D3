// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

  //  when the browser loads,
  // remove it and replace it if the SVG area isn't empty and resize the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  };

  // SVG wrapper dimensions are determined by the current width and height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  
// Load data from healthcare.csv
d3.csv("./Assets/Data/healthdata.csv", function(error, HData) {
  if (error) return console.warn(error);

  console.log(HData);

  
  // map the data 
  var id = HData.map(data => data.id);
  var state = HData.map(data => data.state);
  var abbr = HData.map(data => data.abbr);
  var poverty = HData.map(data => data.poverty);
  var povertyMoe = HData.map(data => data.povertyMoe);
  var age = HData.map(data => data.age);
  var income = HData.map(data => data.income);
  var incomeMoe = HData.map(data => data.incomeMoe);
  var healthcare = HData.map(data => data.healthcare);
  var healthcareLow = HData.map(data => data.healthcareLow);
  var healthcareHigh = HData.map(data => data.healthcareHigh);
  var obesity = HData.map(data => data.obesity);
  var obesityLow = HData.map(data => data.obesityLow);
  var obesityHigh = HData.map(data => data.obesityHigh);
  var smokes = HData.map(data => data.smokes);
  var smokesLow = HData.map(data => data.smokesLow);
  var smokesHigh = HData.map(data => data.smokesHigh);

  // Cast each hours value in tvData as a number using the unary + operator
  HData.forEach(function(data) {
    data.income = +data.income;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;


    // console.log("ID: ", data.id);
    // console.log("State :", data.state);
    // console.log("Abbr :", data.abbr);
    // console.log("Poverty:", data.poverty);
    // console.log("PovertyMoe:", data.povertyMoe);
    // console.log("Age:", data.age);
    // console.log("Income:", data.income);
    // console.log("IncomeMoe:", data.incomeMoe);
    // console.log("Healthcare:", data.healthcare);
    // console.log("Healthcare Low:", data.healthcareLow);
    // console.log("Healthcare High:", data.healthcareHigh);
    // console.log("Obesity:", data.obesity);
    // console.log("Obesity Low:", data.obesityLow);
    // console.log("Obesity High:", data.obesityHigh);
    // console.log("Smokes:", data.smokes);
    // console.log("Smokes Low:", data.smokesLow);
    // console.log("Smokes High:", data.smokesHigh);

  });
  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // create scales
  var xPovertyScale = d3.scaleLinear()
    .domain(d3.extent(HData, d => d.poverty))
    .range([0, width]);

  var xAgeScale = d3.scaleLinear()
    .domain(d3.extent(HData, d => d.age))
    .range([0, width]);

  var xIncomeScale = d3.scaleLinear()
    .domain(d3.extent(HData, d => d.income))
    .range([0, width]);

  var ySmokesScale = d3.scaleLinear()
    .domain([0, d3.max(HData, d => d.smokes)])
    .range([height, 0]);
  
  var yObesityScale = d3.scaleLinear()
    .domain([0, d3.max(HData, d => d.obesity)])
    .range([height, 0]);

  var yHealthcareScale = d3.scaleLinear()
    .domain([0, d3.max(HData, d => d.healthcare)])
    .range([height, 0]);

 // Line Generator
  var line = d3.line()
    .x((d, i) => xPovertyScale(i))
    .y(d => ySmokesScale(d));

  // create axes
  var xAxis = d3.axisBottom(xPovertyScale);
  var yAxis = d3.axisLeft(ySmokeScale).ticks(6);

  // append axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // line generator
  var line = d3.line()
    .x(d => xPoverty(d.poverty))
    .y(d => yLinearScale1(d.smokes));

  // append line
  chartGroup.append("path")
    .data([HData])
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "transparent"); 

      // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(HData)
    .enter()
    .append("circle")
    .attr("cx", d => (d, i) => xScale(i))
    .attr("cy", d => d => yScale(d))
    .attr("r", "10")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "black");


  // Step 1: Append tooltip div
  // var toolTip = d3.select("body")
  //   .append("div")
  //   .classed("tooltip", true);
  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip");

  // Step 2: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.style("display", "block");
        toolTip.html(`<strong>${d.poverty}<strong><hr>${d.smokers} % Smokers <strong><hr>${d.abbr}`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      })

  // Step 3: Create "mouseout" event listener to hide tooltip
    on("mouseout", function() {
      toolTip.style("display", "none");
    });

});


}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
 


// // create axes
  // var xAxis = d3.axisBottom(xPoverty);
  // var yAxis = d3.axisLeft(yLinearScale2).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xPoverty);
  // var yAxis = d3.axisLeft(yLinearScale3).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xAge);
  // var yAxis = d3.axisLeft(yLinearScale1).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xAge);
  // var yAxis = d3.axisLeft(yLinearScale2).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xAge);
  // var yAxis = d3.axisLeft(yLinearScale3).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xIncome);
  // var yAxis = d3.axisLeft(yLinearScale1).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xIncome);
  // var yAxis = d3.axisLeft(yLinearScale2).ticks(6);

  // // create axes
  // var xAxis = d3.axisBottom(xIncome);
  // var yAxis = d3.axisLeft(yLinearScale3).ticks(6);

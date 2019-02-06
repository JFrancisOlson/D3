// jeff olson d3


var svgWidth = 1000;
var svgHeight = 750;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(healthData, d => d[chosenYAxis]) * 0.8,
      d3.min(healthData, d => d[chosenYAxis]) * 0.8
    ])
    .range([0, height]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(750)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(750)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(750)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with a transition to
// new circles
function renderYCircles(circlesGroup,  newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(750)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty % :";
  }
  else {
      if (chosenXAxis === "age") {
        var label = "Age (median):";
      }
      else { 
        var label = "Household Income (median):"; }
  }
  

  if (chosenYAxis === "healthcare") {
    var label = "Lack of Healthcare % :";
  }
  else {
      if (chosenYAxis === "obesity") {
        var label = "Obesity %:";
      }
      else { 
        var label = "Smoker %:"; }
  }
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    })
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenYAxis]}`);
    });


  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/healthData.csv", function(err, healthData) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    // data.abbr = data.abbr;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(healthData, d => d.healthcare)])
  //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  
  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "lightblue")
    .attr("opacity", ".8");
    

  var circleTextGroup = chartGroup.append("g");

  var circleText = circleTextGroup.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .style("text-anchor", "end")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]));
       

  // console.log(circleText);

  var textLabels = circleText
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("class", "stateCircle")
    .text(function(d){
      return d.abbr;
     });

  
    
  // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 10})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty %");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (median) %");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 65)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (median)");

  // append y axis
// Create group for  3 y - axis labels
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 10})`);
  
  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lack of Healthcare %");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 20 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity %");
   
  var smokerLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 40 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smoker %");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
            xlabelsGroup.selectAll("text")
              .on("click", function() {

              // get value of selection
              var value = d3.select(this).attr("value");
              if (value !== chosenXAxis) {

                // replaces chosenXaxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                  ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  }
                else {
                  if  (chosenXAxis === "poverty") {
                    povertyLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    incomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    }
                    else {
                    incomeLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    povertyLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    }
                  }
                }
              });

      
        // y axis labels event listener
          ylabelsGroup.selectAll("text")
          .on("click", function() { 

            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

              // replaces chosenXaxis with value
              chosenYAxis = value;

              console.log(chosenYAxis)

              // functions here found above csv import
              // updates x scale for new data
              yLinearScale = yScale(healthData, chosenYAxis);

              // updates x axis with transition
              yAxis = renderYAxes(yLinearScale, yAxis);

              // updates circles with new x values
              circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

              // updates tooltips with new info
              circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

              // changes classes to change bold text
              if (chosenXAxis === "obesity") {
                obesityLabel
                  .classed("active", true)
                  .classed("inactive", false);
                smokerLabel
                  .classed("active", false)
                  .classed("inactive", true);
                healthcareLabel
                  .classed("active", false)
                  .classed("inactive", true);
                }

              else {
                if  (chosenXAxis === "poverty") {
                  smokerLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    }
                  else {
                  healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  smokerLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  }
                }
              }
            });


});


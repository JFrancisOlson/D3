// Load data from hours-of-tv-watched.csv
d3.csv("./Assets/Data/healthdata.csv", function(error, HData) {
  if (error) return console.warn(error);

  console.log(HData);

  // log a list of names
  var id = HData.map(data => data.id);
  
  console.log("id", id);

  // Cast each hours value in tvData as a number using the unary + operator
  HData.forEach(function(data) {
    data.income = +data.income;
    
    console.log("ID: ", data.id);
    console.log("State :", data.state);
    console.log("Abbr :", data.abbr);
    console.log("Poverty:", data.poverty);
    console.log("PovertyMoe:", data.povertyMoe);
    console.log("Age:", data.age);
    console.log("Income:", data.income);
    console.log("IncomeMoe:", data.incomeMoe);
    console.log("Healthcare:", data.healthcare);
    console.log("Healthcare Low:", data.healthcareLow);
    console.log("Healthcare High:", data.healthcareHigh);
    console.log("Obesity:", data.obesity);
    console.log("Obesity Low:", data.obesityLow);
    console.log("Obesity High:", data.obesityHigh);
    console.log("Smokes:", data.smokes);
    console.log("Smokes Low:", data.smokesLow);
    console.log("Smokes High:", data.smokesHigh);

  })
});

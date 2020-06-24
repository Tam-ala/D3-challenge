// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 960;
var svgHeight = 500;

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
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(timesData, chosenXAxis) {
    // create scales
    // add an if-else for healthcare since it doesn't want the 0.8 & 1.2!!!
    if (chosenXAxis != "healthcare") {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(timesData, d => d[chosenXAxis]) * 0.8,
            d3.max(timesData, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, width]);

        return xLinearScale;
    }
    else {
        return xLinearScale;
    }

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "healthcare") {
        label = "Healthcare:";
    }
    else {
        label = "Income";
    }

    // add tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            // return d.abbr;
            return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("../data/data.csv").then(function (timesData, err) {
    if (err) throw err;

    // parse data
    timesData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.income = parseInt(+data.income);
        data.smokes = +data.smokes;
    });

    // xLinearScale function above csv import. UNCOMMNET IF NEEDED!!!
    // var xLinearScale = xScale(timesData, chosenXAxis);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(timesData, d => d.smokes)])
        .range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(timesData, d => d.income)])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(timesData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.income))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // append text to circles
    var textCircles = chartGroup.selectAll("#circleText")
        .data(timesData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("id", "circleText")
        .attr("x", d => xLinearScale(d[chosenXAxis]) - 5)
        .attr("y", d => yLinearScale(d.income) + 4)
        .attr("stroke-width", "1")
        .attr("fill", "white")
        .attr("font-size", 8);

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var healthcareLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Healthcare in each State(measurement?)");

    var smokesLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Income in each State");

    // append y axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Income Amount");

    // // for the x axis label....
    // chartGroup.append("text")
    //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    //     .attr("class", "axisText")
    //     .text("Unemployment Rate for women under 25-44 years of age");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(timesData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});

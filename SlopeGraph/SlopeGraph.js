/*
Create two data structures. One is the lines data, another is a part description lookup with cost
*/

//Set SVG parameters for Visualization
var data
var slopegraph_svg

var margin = {"left":60, "right":60, "top":20, "bottom": 300}
var height = 760 - margin.top - margin.bottom
var width = 1280 - margin.left - margin.right

//Array for all years standards are available
//Perhaps
var years = [2013,2014,2015]

//Set Scales for visualization
//Fix the domain later
var x_scale = d3.scale.linear()
                .domain([2013, 2015])
                .rangeRound([0,width])
                //.rangeRoundBands([0,width])


//Change this as its going to go from -max to + max
var y_scale = d3.scale.linear()
                .domain([-200,200])
                .range([height, 0])

//Drawing Functions    
function draw_canvas(){
    //Adds svg and draws year lines
    slopegraph_svg = d3.select("body")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
    //Maybe I should do this with scales instead. Consider it later
    slopegraph_svg.selectAll(".year_line")
                .data(years)
                .enter()
              .append("line")
                .attr("x1", function(d) {return x_scale(d);})
                .attr("x2", function(d) {return x_scale(d);})
                .attr("y1", 0)
                .attr("y2", height)
                .attr("class", "year_line")
    
    }
function add_axes() {
    //Draws the axes for the years and cost
    var xAxis = d3.svg.axis()
          .scale(x_scale)
          .orient("bottom")
          .tickValues(years)
    
    var yAxis = d3.svg.axis()
          .scale(y_scale)
          .orient("right")
          
     
    slopegraph_svg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)



    slopegraph_svg.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + (width + 20) + ",0)")
                .call(yAxis)
}

function draw_cost_lines(data) {
    //Draws cost lines
    //Decided on data structure where each line is it's own object
    
    slopegraph_svg.selectAll(".cost_line")
        .data(data)
      .enter()
      .append("line")
        .attr("x1", function(d) {return x_scale(d["x1"])})
        .attr("x2", function(d) {return x_scale(d["x2"])})
        .attr("y1", function(d) {return y_scale(d["y1"])})
        .attr("y2", function(d) {return y_scale(d["y2"])})
        .attr("class", "cost_line")
    }
    
d3.json("data_2.json", function(error, json) {
    //Load data and construct 
    data = json   
    draw_canvas()
    add_axes()
    draw_cost_lines(data)
    });
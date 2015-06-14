/*
Create two data structures. One is the lines data, another is a part description lookup with cost
*/

//Set SVG parameters for Visualization
var json_file
var slopegraph_svg

var marginforDescriptionDiv = 40
var margin = {"left":60, "right":90, "top":40, "bottom": 40};
var height = window.innerHeight - margin.top - margin.bottom - 40;
var width = 1200 - margin.left - margin.right;

//Array for all years standards are available
var years = [2013,2014,2015];

//Set Scales for visualization
var x_scale = d3.scale.linear()
                .domain([2013, 2015])
                .rangeRound([0,width]);

//YAxis hoisted for updates
var yAxis
var y_scale = d3.scale.linear()
                .rangeRound([height, 0]);
                

//Helper Functions
function part_num_string(svg_element) {return d3.select(svg_element).datum()["key"].substring(0,12);}

function line_selector(part_num) {
  //Takes line element and returns selection of all other lines with same part number
  
  var part_num_lines = d3.selectAll(".cost_line")
                      .filter(function(d, i) {return d["key"].substring(0,12) === part_num})
  
  //debugger
  return part_num_lines
};


function hours_mouseover_generator(part_num, part_num_lines) {
  //Takes part num and line selection and creates labels for total hours
  debugger
  var base_cost = json_file["part_attr"][part_num]["base_cost"]
  var hours_array = []
  
  part_num_lines.data().forEach(function(d) {
    hours_array.push({"year": d["x1"], "cost": base_cost + d["y1"]}, {"year": d["x2"], "cost": base_cost + d["y2"]})
  });
  
  if (part_num === "10393264-032") {
    //debugger
  }
  
  return hours_array
};

function all_y(lines_array) {
  //Returns an array of all y values from input JSON
  y_values = []
  
  lines_array.forEach(function(d) {
    y_values.push(d["y1"], d["y2"])
  });
  
  return y_values
}

//Drawing Functions    
function draw_canvas(){
    //Adds svg and draws year lines
    slopegraph_svg = d3.select("#Slopegraph")
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
    
function draw_axes() {
    //Draws the axes for the years and cost
    var xAxis = d3.svg.axis()
          .scale(x_scale)
          .orient("top")
          .tickValues(years)
          .tickFormat(d3.format("d"))
    
    yAxis = d3.svg.axis()
          .scale(y_scale)
          .orient("right")
          
     
    slopegraph_svg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0,25)")
                .call(xAxis)
               .selectAll("text")
                 .attr("transform", "rotate(-90)")

    slopegraph_svg.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + (width + 20) + ",0)")
                .call(yAxis)
}
    
function draw_cost_lines(json_file) {
    //Draws cost lines
    //Decided on data structure where each line is it's own object
    
    slopegraph_svg.selectAll(".cost_line")
        .data(json_file["costs"])
      .enter()
      .append("line")
        .attr("x1", function(d) {return x_scale(d["x1"])})
        .attr("x2", function(d) {return x_scale(d["x2"])})
        .attr("y1", y_scale(0))
        .attr("y2", y_scale(0))
        .attr("class", "cost_line")
        .attr("stroke", function(d) {return d["y1"] > d["y2"] ? "green": (d["y1"] < d["y2"] ? "red" : "black");})
        .attr("opacity", .1)
      .on('click', function() {window.open("http://eng.nov.com/TC_V3.swf?pn=" + part_num_string(this));})
      .on("mouseover", function() {
            var part_num = part_num_string(this)
            
            //Highlight parts line
            var part_lines = line_selector(part_num)
            part_lines
              .style("stroke-width", "5px")
              .style("opacity", 1);
            
            //Add labels for hours on top of each year line
            slopegraph_svg.selectAll(".Total_Hours")
              .data(hours_mouseover_generator(part_num, part_lines))
            .enter()
              .append("text")
              .text(function(d) {return d["cost"] + " hours";})
              .attr("class", "Total_Hours")
              .attr("x", function(d) {return x_scale(d["year"]);})
              .attr("y", -10)
              .attr("text-anchor", "middle");
              
            //Change text to include part number
            var desc = json_file["part_attr"][part_num]["desc"]
            
            d3.select("#Title h3")
              .text(part_num + "-" + desc)
          })
      .on("mouseout", function(d) {  
            var part_num = part_num_string(this)    
            
            line_selector(part_num)
              .style("stroke-width", null)
              .style("opacity", null);
              
             slopegraph_svg.selectAll(".Total_Hours").remove()
             
             d3.select("#Title h3")
              .text("Each line is a change in average part standard for a workcenter. Hover over lines for detail")
          })
        .transition()
          .attr("x1", function(d) {return x_scale(d["x1"]);})
          .attr("x2", function(d) {return x_scale(d["x2"]);})
          .attr("y1", function(d) {return y_scale(d["y1"]);})
          .attr("y2", function(d) {return y_scale(d["y2"]);});
          
         slopegraph_svg.select(".yAxis")
           .transition()
           .call(yAxis)
}
    
function create_graph(resource_name) {
  //Create slopegraph given resource name
  var json_filename = resource_name + ".json"
  
  d3.json(json_filename, function(error, json) {
      //Load data and construct slopegraph
      json_file = json 
      var max_y = d3.max(all_y(json_file["costs"]), function(d) {return Math.abs(d)})
      y_scale.domain([-max_y, max_y])
      draw_cost_lines(json_file)
      
      }); 
}

//UI Elements
$("button").click(function() {
    //Get resource name and create callback to pass
    var resource_name = this.textContent;
    function graph_callback() {
      create_graph(resource_name);
    }
    
    //Scroll to given id
    smoothScroll.animateScroll(null, "#Slopegraph", {speed: 2000, easing: 'easeInCubic', callbackAfter:graph_callback});
});

//Initialize graph
draw_canvas()
y_scale.domain([0,0])
draw_axes()
smoothScroll.init()

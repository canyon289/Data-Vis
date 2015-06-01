/*
TODO
Add sorting capability
Change functionality to only items with cost
*/


//Create global variables for data, margins
var data

var margin = {top:20 ,right: 80, bottom:30, left:40};
var row_height = 30;
var row_margin = 15;
var width = 960

//Define color scale
var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888"])

d3.csv("CostExample.csv", function(error, csv) {

	data = csv
	var height = data.length * (row_height + row_margin)
	
	//Get keys of cost values
	var costNames = d3.keys(data[0])
                        .filter(function(header) {
                            return ["Row Number", "Part Number", "Description"].indexOf(header) === -1;
                        });

  /*Iterate over data array, for each object define a new object labeled costs
  which is an object with two values */
	data.forEach(function(d) {
		d.costs = costNames.map( function(cost) {return {cost:cost, value:+d[cost]};});
	});
    
	//Create X scale
    cost_scale = d3.scale.linear()
                 .domain([0, d3.max(data, function(d) {return d3.max(d.costs, function(d) {return d.value;})})])
                 .range([width, 0])
	
	//Create Axis
    days_axis= d3.svg.axis()
					.scale(x)
					.orient(top)
					.innerTickSize([height])
    
    //Set scale for cost bars
	var y1 = d3.scale.ordinal()
                .domain(costNames)
				.rangeRoundBands([0, row_height])

	//Phew the data formatting is done! Onto the svg
	//Lets append the svg with the margins as per convention, we do this using a transform
	var svg_canvas = d3.select("#row_chart_div")
						.append("svg")
						  .attr("height", height + margin.top + margin. bottom)
						  .attr("width", width + margin.left + margin.right)
						.append("g")
						  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Add Top Scale, then select text elements and modify position
    svg_canvas.append("g")
                .call(days_axis)
                .attr("class", "days_axis")
              .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("y", ".0")

    //Start adding groups for the groups of cost bars
    var part_cost_groups = svg_canvas.selectAll(".part_cost_group")
                .data(data, function(d) {return d["Part Number"];})
              .enter().append("g")
                .attr("class", "part_cost_group")
                .attr("transform", function(d,i) {return "translate(0,"+ (20 + i*(row_height + row_margin)) + ")";})    
    
    //How it is getting the value
    //Getting value datum is automatically passed from selections
        part_cost_groups.selectAll("rect") 
              .data(function(d) {
                  debugger
                  return d.costs;})
               .enter().append("rect")
               .attr("x", function(d) {return cost_scale(d["value"]);})
               .attr("y", function(d) {return y1(d["cost"]);} )
               .attr("width", function(d) {return width - x(d["value"]) ;} )
               .attr("height", y1.rangeBand())
               .attr("fill", function(d) {return color(d["cost"]) ;})
    
        //Add Label
        //Eventually change this to html
        //Double check how selections work to get this right
        /*part_cost_group.selectAll("text")
            .data(function(d) {return [d["Part Number"]];})
          .enter().append("text")
            .text(function(d) {return d;})
            .attr("class", "label")
            .attr("x", 0)
            .attr("y", 0)
        */
        
        //These functions are identical!    
        part_cost_groups
            .datum(function(d) {return d;})
            .append("text")
            .text(function(d) {return d["Part Number"] +": " + d["Description"];})
            .attr("class", "label")
            .attr("x", width + 5)
            .attr("y", 10)
            
      
      //Transition to single bars
      /*
      part_cost_groups.selectAll("rect")
                    .data(function(d) {return d["PO Cost"] - d["Frozeon Cost"];})
                    .enter().append("rect")
      */
      
      
      //Add sort function
      function data_sort(attribute){
        var sorted_data = data.sort(function(a,b) {
            return a[attribute] - b[attribute]
            });
       //Create some fake data to append
        return sorted_data
      };
      
      //Add Update Function
      function sort_bars(attr) {
              svg_canvas.selectAll(".part_cost_group")
                .data(data_sort(attr), function(d) {return d["Part Number"];})
                .transition()
                .delay(function(d, i) {return i * 200;})
                .attr("transform", function(d,i) {return "translate(0,"+ (20 + i*(row_height + row_margin)) + ")";})
      }
      
      $('#frozen_sort').on('click', function () {
        console.log(data_sort("Frozen Cost"))
        var attr = "Frozen Cost"
            sort_bars(attr)
        }); 
      
      $('#buy_sort').on('click', function () {
        console.log(data_sort("Frozen Cost"))
        
        var attr = "PO Cost"
        sort_bars(attr)
      })               
});
// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
let
  width = 600,
  height = 400;
  
let margin = {
  top: 40,
  bottom: 40,
  left: 60,
  right: 50
};


    // Create the SVG container
let svg = d3
  .select("#boxplot")
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', '#e9f7f2');


    // Set up scales for x and y axes
    // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
    // d3.min(data, d => d.Likes) to achieve the min value and 
    // d3.max(data, d => d.Likes) to achieve the max value
    // For the domain of the xscale, you can list all four platforms or use
    // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform
    

    // Add scales     
let yScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([height - margin.bottom, margin.top]);
    
let xScale = d3.scaleBand()
    .domain(
       data.map(d => d.Platform)
      )
    .range([margin.left, width - margin.right])
    .padding(0.5);

    // Add x-axis label
let xAxis = svg
    .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom().scale(xScale));
    
  //Add label
xAxis
    .append('text')
      .attr('x', 65 + (width - margin.left - margin.right) / 2)
      .attr('y', 30)
      .style("fill", "black")
      .style("font-size", "13px")
      .text('Platform');
  

    // Add y-axis label
  let yAxis = svg
    .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScale));
  yAxis.append("text")
      .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "13px")
      .text("Number of Likes");

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25);
        const q3 = d3.quantile(values, 0.75);
        const max = d3.max(values);
        const median = d3.quantile(values, 0.5)
        return {min, q1, q3, max, median};
    };

    // This code splits the data up by groups and then passes them through the rollup function
    // This is done in order to calculate all the needed values for each platform. 
    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

    // Takes each platform and assigns them an x value and the width of the box
    quantilesByGroups.forEach((quantiles, Platform) => {
        const x = xScale(Platform);
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
  svg.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', yScale(quantiles.min))
        .attr('y2', yScale(quantiles.max))
        .attr('stroke', 'black');

        // Draw box
    svg.append('rect')
        .attr('x', x - boxWidth / 2)
        .attr('y', yScale(quantiles.q3))
        .attr('width', boxWidth)
        .attr('height', yScale(quantiles.q1) - yScale(quantiles.q3))
        .attr('fill', '#8134AF')
        .attr('stroke', 'black');

        // Draw median line
    svg.append('line')
        .attr('x1', x - boxWidth / 2)
        .attr('x2', x + boxWidth / 2 )
        .attr('y1', yScale(quantiles.median))
        .attr('y2', yScale(quantiles.median))
        .attr('stroke', 'black');
    });

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2) 
    .attr("text-anchor", "middle") 
    .style("fill", "black") 
    .style("font-size", "18px") 
    .text("Distribution of Likes Across Different Platforms");
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
      d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
let
  width = 600,
  height = 400;
  
let margin = {
  top: 40,
  bottom: 40,
  left: 70,
  right: 40
};

    // Create the SVG container
    
  let svg = d3
    .select("#barplot")
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#e9f7f2');

    // Define four scales
    // Scale x0 is for the platform, which divide the whole scale into 4 parts
    // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
    // Recommend to add more spaces for the y scale for the legend
    // Also need a color scale for the post type

  const x0 = d3.scaleBand()
      .domain([...new Set(data.map(d => d.Platform))])
      .range([margin.left, width - margin.right]) 
      .padding(0.25);
      

    const x1 = d3.scaleBand()
      .domain([...new Set(data.map(d => d.PostType))])
      .range([0, x0.bandwidth()]) 
      .padding(0.15);

    const y = d3.scaleLinear()
      .domain([0, 700])
      .range([height - margin.bottom, margin.top]);
      

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.PostType))])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
    // Add scales x0 and y     
    let xAxis = svg
    .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom().scale(x0));
    
    let yAxis = svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(y));

    // Add x-axis label

  xAxis
    .append('text')
      .attr('x', 65 + (width - margin.left - margin.right) / 2)
      .attr('y', 30)
      .style("fill", "black")
      .style("font-size", "13px")
      .text('Platform');
  yAxis.append("text")
      .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "13px")
      .text("Average Likes");
  
  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars

  barGroups.append("rect")
    .attr("x", d => x1(d.PostType))
    .attr("y", d => y(d.Likes)) 
    .attr("width", x1.bandwidth()) 
    .attr("height", d => height - margin.bottom - y(d.Likes)) 
    .attr("fill", d => color(d.PostType))
    .attr("stroke", "Black"); 

    // Add the legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
      legend.append("rect")
        .attr("x", 0)  
        .attr("y", i * 20)  
        .attr("width", 15)  
        .attr("height", 15) 
        .attr("stroke", "black")
        .attr("fill", color(type)) 

      
      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");
  });
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2) 
    .attr("text-anchor", "middle") 
    .style("fill", "black") 
    .style("font-size", "18px") 
    .text("Average Likes by Platform and Post Type");

});

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
      d.Likes = +d.Likes;
  });

    // Define the dimensions and margins for the SVG
let
    width = 600,
    height = 400;
    
let margin = {
    top: 40,
    bottom: 80,
    left: 60,
    right: 40
  };    

    // Create the SVG container
let svg = d3
    .select('#lineplot')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#e9f7f2');   

    // Set up scales for x and y axes  
let yScale = d3.scaleLinear()
    .domain([0, 600])
    .range([height - margin.bottom, margin.top]);
    
let xScale = d3.scaleBand()
    .domain(
       data.map(d => d.Date)
      )
    .range([margin.left, width - margin.right])
    .padding(0.5);

    // Draw the axis, you can rotate the text in the x-axis here

let xAxis = svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`) 
    .call(d3.axisBottom().scale(xScale))

xAxis 
    .selectAll("text") 
    .attr("transform", "rotate(-25)") 
    .style("text-anchor", "end"); 

let yAxis = svg
    .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScale));


    // Add x-axis label
xAxis
    .append('text')
      .attr('x', 60 + (width - margin.left - margin.right) / 2)
      .attr('y', 70)
      .style("fill", "black")
      .style("font-size", "13px")
      .text('Date');

    // Add y-axis label
yAxis.append("text")
    .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size", "13px")
    .text("Average Likes");


    // Draw the line and path. Remember to use curveNatural. 
let line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Likes))
    .curve(d3.curveNatural);

let path = svg.append("path")
            .datum(data) 
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);


  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2) 
    .attr("text-anchor", "middle") 
    .style("fill", "black") 
    .style("font-size", "18px") 
    .text("Social Media Likes Over Time");

});



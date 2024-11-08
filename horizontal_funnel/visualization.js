const dscc = require('@google/dscc');
const d3 = require('d3');

// Set up a responsive SVG for the chart
const drawViz = (data) => {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG
    d3.select("body").selectAll("svg").remove();

    // Create a new SVG element
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract stage names and values
    const stages = data.tables.DEFAULT.map(row => row['Stage']);
    const values = data.tables.DEFAULT.map(row => +row['Value']);

    // Create a color scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([d3.max(values), d3.min(values)]);

    // Create x and y scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(stages)
        .range([0, height])
        .padding(0.4);

    // Draw the funnel bars
    svg.selectAll(".bar")
        .data(values)
        .enter()
        .append("rect")
        .attr("y", (d, i) => yScale(stages[i]))
        .attr("width", d => xScale(d))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d));

    // Add stage labels
    svg.selectAll(".label")
        .data(stages)
        .enter()
        .append("text")
        .attr("y", (d, i) => yScale(d) + yScale.bandwidth() / 2)
        .attr("x", 5)
        .attr("dy", ".35em")
        .text(d => d)
        .attr("fill", "white");

    // Add value labels
    svg.selectAll(".value")
        .data(values)
        .enter()
        .append("text")
        .attr("y", (d, i) => yScale(stages[i]) + yScale.bandwidth() / 2)
        .attr("x", d => xScale(d) - 30)
        .attr("dy", ".35em")
        .text(d => d)
        .attr("fill", "black");
};

// Subscribe to the data provided by Looker Studio
dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });

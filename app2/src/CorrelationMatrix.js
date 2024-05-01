import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CorrelationMatrix = ({ rawData }) => {
  const chartRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!rawData || rawData.length === 0) return;

    // Clean and filter data
    const cleanedData = rawData.map(entry => ({
      total_bill: parseFloat(entry.total_bill), // Convert to number
      tip: parseFloat(entry.tip), // Convert to number
      size: parseInt(entry.size) // Convert to integer
    }));
    const filteredData = cleanedData.filter(entry => !Object.values(entry).some(isNaN));

    // Draw chart
    drawChart(filteredData);
    drawLegend();
  }, [rawData]);

  const drawChart = (data) => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const variables = Object.keys(data[0]);

    const matrix = [];
    variables.forEach((rowVar, i) => {
      variables.forEach((colVar, j) => {
        matrix.push({
          rowVar,
          colVar,
          value: i === j ? 1 : d3.mean(data, d => d[rowVar] * d[colVar])
        });
      });
    });

    const uniqueValues = Array.from(new Set(matrix.map(d => d.value)));
    const color = d3.scaleOrdinal()
      .domain(uniqueValues)
      .range(d3.schemeCategory10); // Use categorical color scale

    const x = d3.scaleBand()
      .domain(variables)
      .range([margin.left, width + margin.left]);

    const y = d3.scaleBand()
      .domain(variables)
      .range([margin.top, height + margin.top]);

    svg.selectAll()
      .data(matrix)
      .join('rect') // Use join instead of append
      .attr('x', d => x(d.colVar))
      .attr('y', d => y(d.rowVar))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', d => color(d.value)); // Use color scale for fill color

    svg.selectAll()
      .data(matrix)
      .join('text') // Use join instead of append
      .attr('x', d => x(d.colVar) + x.bandwidth() / 2)
      .attr('y', d => y(d.rowVar) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('fill', d => d3.lab(color(d.value)).l > 70 ? 'black' : 'white')
      .text(d => d3.format('.2f')(d.value));

    svg.selectAll('.rowLabel')
      .data(variables)
      .join('text') // Use join instead of append
      .attr('class', 'rowLabel')
      .attr('x', margin.left - 20)
      .attr('y', (d, i) => y(variables[i]) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => d);

    svg.selectAll('.colLabel')
      .data(variables)
      .join('text') // Use join instead of append
      .attr('class', 'colLabel')
      .attr('x', (d, i) => x(variables[i]) + x.bandwidth() / 2)
      .attr('y', margin.top + height + 20)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d);

    svg.append('g')
      .attr('transform', `translate(0, ${margin.top})`)
      .call(d3.axisLeft(y));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisTop(x));
  };

  const drawLegend = () => {
    const svg = d3.select(legendRef.current);
    svg.selectAll('*').remove();

    const colorScale = d3.scaleLinear()
      .domain([0, 1])
      .range(['#ffffff', '#000000']); // Define the color range from white to black

    const legendWidth = 20; // Reduce width for a vertical legend
    const legendHeight = 200; // Increase the height for a vertical legend

    // Create a gradient for the legend
    svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradientLegend")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%") // Vertical gradient
      .attr("y2", "100%") // Vertical gradient
      .selectAll("stop")
      .data(colorScale.ticks(10)) // Adjust the number of ticks as needed
      .enter().append("stop")
      .attr("offset", (d, i) => (i * 100) / 9 + "%")
      .attr("stop-color", d => colorScale(d));

    // Draw the legend rectangle
    svg.append("rect")
      .attr("width", legendWidth) // Adjust width for a vertical legend
      .attr("height", legendHeight)
      .style("fill", "url(#gradientLegend)")
      .attr("transform", "translate(0,10)");

    // Add legend labels
    const tickValues = colorScale.ticks(10); // Adjust the number of ticks as needed
    svg.selectAll(".legendLabel")
      .data(tickValues)
      .enter().append("text")
      .attr("class", "legendLabel")
      .attr("x", 25) // Adjust x-position for text
      .attr("y", (d, i) => (i * legendHeight) / (tickValues.length - 1) + 10) // Adjust y-position for text
      .attr("dy", "0.35em")
      .style("text-anchor", "start")
      .text(d => d.toFixed(2)); // Format tick values as needed
  };

  return (
    <div>
      <svg ref={chartRef} width={600} height={600} />
      <svg ref={legendRef} width={50} height={220} />
    </div>
  );
};

export default CorrelationMatrix;

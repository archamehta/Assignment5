// Scatterplot.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Scatterplot = ({ data, xVariable, yVariable }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[xVariable])])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yVariable])])
      .range([height, 0]);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[xVariable]))
      .attr("cy", d => yScale(d[yVariable]))
      .attr("r", 5)
      .style("fill", "steelblue");

    // Add x-axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

  }, [data, xVariable, yVariable]);

  return <svg ref={chartRef}></svg>;
};

export default Scatterplot;

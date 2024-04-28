// BarChart.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, xVariable, yVariable }) => {
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

    const xScale = d3.scaleBand()
      .domain(data.map(d => d[xVariable]))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yVariable])])
      .nice()
      .range([height, 0]);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d[xVariable]))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d[yVariable]))
      .attr("height", d => height - yScale(d[yVariable]));

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

  }, [data, xVariable, yVariable]);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;

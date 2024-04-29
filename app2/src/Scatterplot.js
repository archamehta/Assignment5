import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Scatterplot = ({ data, xVariable, yVariable }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const parentWidth = chartRef.current.parentElement.clientWidth;
    const width = parentWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xExtent = d3.extent(data, d => d[xVariable]);
    const yExtent = d3.extent(data, d => d[yVariable]);

    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([height, 0]);

    const svg = d3.select(chartRef.current)
      .attr("width", parentWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[xVariable]))
      .attr("cy", d => yScale(d[yVariable]))
      .attr("r", 5)
      .style("fill", "steelblue");

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

  }, [data, xVariable, yVariable]);

  return <svg ref={chartRef}></svg>;
};

export default Scatterplot;

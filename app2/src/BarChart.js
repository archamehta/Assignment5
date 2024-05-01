import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, yVariable }) => {
  const chartRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const parentHeight = chartRef.current.parentElement.clientHeight;
    const margin = { top: 20, right: 20, bottom: 70, left: 40 };
    const height = parentHeight - margin.top - margin.bottom;
    const width = 400 - margin.left - margin.right;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yVariable])])
      .nice()
      .range([height, 0]);

    const svg = d3.select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.day))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d[yVariable]))
      .attr("height", d => height - yScale(d[yVariable]));

    if (!xAxisRef.current) {
      xAxisRef.current = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
    } else {
      xAxisRef.current.call(d3.axisBottom(xScale));
    }

    if (!yAxisRef.current) {
      yAxisRef.current = svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
    } else {
      yAxisRef.current.call(d3.axisLeft(yScale));
    }

  }, [data, yVariable]);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;

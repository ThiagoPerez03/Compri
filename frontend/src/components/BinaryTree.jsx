import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import './BinaryTree.css';

import huffmanTreeData from '../Data/TreeData'; 

const D3BinaryTree = () => {
  const svgRef = useRef(null);

  const width = 1000;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const nodeRadius = 15;
  const nodeTextFontSize = 10; 
  const nodeTextOffset = 20;
  const treeNodeSeparation = 25;
  const treeLevelSeparation = 40;


  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / treeNodeSeparation);

    const rootNode = d3.hierarchy(huffmanTreeData);
    const treeData = treeLayout(rootNode);

    g.selectAll('.link')
      .data(treeData.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
      );

    g.selectAll('.link-label')
      .data(treeData.links())
      .enter().append('text')
      .attr('class', 'link-label')
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2)
      .attr('dy', -5)
      .attr('text-anchor', 'middle')
      .text(d => d.target.data.code)
      .style('fill', '#555')
      .style('font-size', '10px');


    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .enter().append('g')
      .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', nodeRadius);

    node.append('text')
      .attr('dy', '0.35em')
      .attr('y', d => d.children ? -nodeTextOffset : nodeTextOffset)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .style('font-size', `${nodeTextFontSize}px`); 

    const bounds = g.node().getBBox();
    const availableWidth = width - margin.left - margin.right;
    const availableHeight = height - margin.top - margin.bottom;

    const scaleX = availableWidth / bounds.width;
    const scaleY = availableHeight / bounds.height;
    const scale = Math.min(scaleX, scaleY);

    g.attr("transform", `translate(${margin.left + (availableWidth - bounds.width * scale) / 2}, ${margin.top + (availableHeight - bounds.height * scale) / 2}) scale(${scale})`);

  }, []);

  return (
    <div className="d3-tree-visualizer-container">
      <h2>Árbol Binario</h2>
      <div className="svg-wrapper">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
    </div>
  );
};

export default D3BinaryTree;
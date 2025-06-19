import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import './BinaryTree.css';

import huffmanTreeData from '../Data/TreeData'; 

const D3BinaryTree = () => {
  const svgRef = useRef(null);

  const width = 1000;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };

  const nodeRadius = 30; 
  const nodeLetterFontSize = 20; 
  const linkLabelFontSize = 20; 
  const linkLabelOffset = 10;

  const treeNodeSeparationFactor = 5; 
  const treeLevelSeparationFactor = 5; 


  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const drawingWidth = width - margin.left - margin.right;
    const drawingHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree()
      .nodeSize([nodeRadius * 2 + treeNodeSeparationFactor * 20, nodeRadius * 2 + treeLevelSeparationFactor * 20])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

    const rootNode = d3.hierarchy(huffmanTreeData);
    const treeData = treeLayout(rootNode);

    treeData.each(d => {
      d.y = d.depth * (nodeRadius * 2 + treeLevelSeparationFactor * 20);
    });

   
    g.selectAll('.link')
      .data(treeData.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => {

        return `M${d.source.x},${d.source.y + nodeRadius}
                L${d.target.x},${d.target.y - nodeRadius}`;
      });

   
    g.selectAll('.link-label')
      .data(treeData.links())
      .enter().append('text')
      .attr('class', 'link-label')
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2)
      .attr('dy', -linkLabelOffset)
      .attr('text-anchor', 'middle')
      .text(d => d.target.data.code)
      .style('font-size', `${linkLabelFontSize}px`); 


    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .enter().append('g')
      .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', nodeRadius) 
      .attr('class', 'node-circle');

    
    node.append('text')
      .attr('dy', '0.35em') 
      .attr('text-anchor', 'middle')
      .text(d => d.data.name) 
      .style('font-size', `${nodeLetterFontSize}px`) 
      .attr('class', 'node-letter-text'); 

    
    const bounds = g.node().getBBox();

    const scaleX = drawingWidth / bounds.width;
    const scaleY = drawingHeight / bounds.height;
    const finalScale = Math.min(scaleX, scaleY);

    const translateX = margin.left + (drawingWidth - bounds.width * finalScale) / 2 - bounds.x * finalScale;
    const translateY = margin.top + (drawingHeight - bounds.height * finalScale) / 2 - bounds.y * finalScale;

    g.attr("transform", `translate(${translateX}, ${translateY}) scale(${finalScale})`);

  }, []);


  return (
    <div className="d3-tree-visualizer-container">
      <div className="d3-tree-header">
        <h2>Árbol Binario</h2>
      </div>
      <div className="svg-wrapper">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
    </div>
  );
};

export default D3BinaryTree;
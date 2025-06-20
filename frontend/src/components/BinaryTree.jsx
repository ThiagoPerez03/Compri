import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BinaryTree.css';

const D3BinaryTree = ({ treeData }) => { 
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!treeData) {
            console.warn("No hay datos de árbol disponibles para renderizar.");
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); 

        const g = svg.append("g");
        
        const rootNode = d3.hierarchy(treeData);

        const treeLayout = d3.tree()
            .nodeSize([80, 120])
            .separation((a, b) => (a.parent === b.parent ? 2 : 2.5));

        const treeNodes = treeLayout(rootNode); 

        g.selectAll('.link')
            .data(treeNodes.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d => {
                return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
            });

        g.selectAll('.link-label')
            .data(treeNodes.links())
            .enter().append('text')
            .attr('class', 'link-label')
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2)
            .attr('dy', '-0.5em') 
            .attr('text-anchor', 'middle')
            .text(d => {
                if (!d.source.children) return '';
                return d.source.children[0] === d.target ? '0' : '1';
            });

        const node = g.selectAll('.node')
            .data(treeNodes.descendants()) 
            .enter().append('g')
            .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
            .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', 25)
            .attr('class', 'node-circle');

        node.append('text')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text(d => d.data.name) 
            .style('font-size', '16px')
            .attr('class', 'node-letter-text');

        const bounds = g.node().getBBox();
        const parent = svg.node().parentElement;
        
        if (bounds.width > 0 && bounds.height > 0 && parent) {
            const fullWidth = parent.clientWidth;
            const fullHeight = parent.clientHeight;
            const scale = Math.min(
                fullWidth / bounds.width, 
                fullHeight / bounds.height
            ) * 0.9;
            const midX = bounds.x + bounds.width / 2;
            const midY = bounds.y + bounds.height / 2;
            const translateX = fullWidth / 2 - midX * scale;
            const translateY = fullHeight / 2 - midY * scale;
            g.attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
        }
    }, [treeData]); 

    return (
        <div className="d3-tree-visualizer-container" ref={containerRef}>
            <div className="d3-tree-header">
                <h2>Árbol Binario</h2> 
            </div>
            <div className="svg-wrapper">
                <svg ref={svgRef} width="100%" height="100%"></svg>
            </div>
        </div>
    );
};

export default D3BinaryTree;

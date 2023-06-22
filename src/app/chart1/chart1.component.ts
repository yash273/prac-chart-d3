import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';

interface ChartData {
  name: string;
  children?: ChartData[];
}

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.scss']
})
export class Chart1Component implements OnInit {

  constructor() { }

  @ViewChild('chartContainer', { static: true }) chartContainer: any

  ngOnInit() {
    const chartData: ChartData = {
      name: 'CEO',
      children: [
        {
          name: 'Manager 1',
          children: [
            { name: 'Team Lead 1' },
            {
              name: 'Team Lead 2',
              children: [
                {
                  name: 'dev 1',
                  children: [
                    {
                      name: 'dev 11'
                    },
                    {
                      name: 'dev 12',
                      children: [
                        {
                          name: 'dev 121'
                        },
                        {
                          name: 'dev 122'
                        },
                        {
                          name: 'dev 123'
                        },
                        {
                          name: 'dev 124'
                        }
                      ]
                    }
                  ]
                },
                {
                  name: 'dev 2',
                  children: [
                    {
                      name: 'dev 21'
                    },
                    {
                      name: 'dev 22'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'Manager 2',
          children: [
            { name: 'Team Lead 3' },
            { name: 'Team Lead 4' }
          ]
        }
      ]
    };

    const container = this.chartContainer?.nativeElement;
    if (container) {
      // Create an SVG element within the container
      const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

      // Set the width and height of the chart
      const width = container.offsetWidth - 200;
      const height = container.offsetHeight;

      // Define the tree layout
      const treeLayout = d3.tree<ChartData>().size([height, width]);

      // Create the hierarchy from the chart data
      const nodes = d3.hierarchy(chartData);

      // Generate the tree layout
      const treeData = treeLayout(nodes);

      // Generate the links between nodes
      const links = treeData.links();

      // Generate the descendants of the tree
      const descendants = treeData.descendants();

      // Create the links between nodes using SVG paths
      const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => {
          return `M${d.source.y},${d.source.x}
                C${(d.source.y + d.target.y) / 2},${d.source.x}
                 ${(d.source.y + d.target.y) / 2},${d.target.x}
                 ${d.target.y},${d.target.x}`;
        });

      // Create the nodes as circles and add text labels
      const node = svg.selectAll('.node')
        .data(descendants)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

      node.append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', -50)
        .attr('y', -25)
        .classed('custom-node', true);

      node.append('text')
        .attr('dy', '0.35em') // Adjust the vertical alignment of the text
        .attr('text-anchor', 'middle') // Center the text horizontally
        .text(d => d.data.name); // Use the data property to set the text content

    }
  }
}

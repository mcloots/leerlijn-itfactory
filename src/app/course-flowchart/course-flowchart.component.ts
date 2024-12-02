import { Component, inject, OnInit } from '@angular/core';
import { Connection, Course } from '../course';
import { CourseService } from '../course.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-course-flowchart',
  imports: [],
  templateUrl: './course-flowchart.component.html',
  styleUrl: './course-flowchart.component.css'
})
export class CourseFlowchartComponent implements OnInit {

  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.courseService.getConnections().subscribe(result => {
      this.fetchCourses(result);
    });

  }

  fetchCourses(connections: Connection[]): void {
    this.courseService.getCourses()  // Replace with your actual API
      .subscribe(courses => {
        // Sort courses by phase, then semester (Semester 3 last within each phase)
        const sortedCourses = courses.sort((a, b) => {
          if (a.phase !== b.phase) return a.phase - b.phase;
          return a.semester === 3 ? 1 : b.semester === 3 ? -1 : a.semester - b.semester;
        });

        this.createFlowchart(sortedCourses, connections);
      });
  }

  createFlowchart(courses: Course[], connections: Connection[]): void {
    const svgWidth = 1800;
    const svgHeight = 1800;
    const columnWidth = svgWidth / 6; // 6 columns
    const rowHeight = 70;

    const svg = d3.select('#flowchart-container')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .classed('responsive-svg', true);

    // Define a mapping for each column
    const columnMapping = [
      { phase: 1, semester: 1 },
      { phase: 1, semester: 2 },
      { phase: 2, semester: 1 },
      { phase: 2, semester: 2 },
      { phase: 3, semester: 1 },
      { phase: 3, semester: 2 }
    ];

    // Create a tracker for the number of courses in each phase and semester
    const phaseSemesterCount: { [key: string]: number } = {};

    // Count courses for each phase and semester
    courses.forEach(course => {
      const key = `${course.phase}-${course.semester}`;
      if (!phaseSemesterCount[key]) {
        phaseSemesterCount[key] = 0;
      }
      phaseSemesterCount[key]++;
    });

    // Create a tracker for occupied columns (row index for each column)
    const columnTracker = Array(6).fill(0); // Array of 6 columns, all initially empty

    // Create courses for the flowchart
    courses.forEach(course => {
      const { xPos, span } = this.getColumnPosition(course.phase, course.semester);
      const xPosition = (xPos - 1) * columnWidth;

      // Determine how much vertical space the course needs, depending on whether it spans one or two columns
      let yPosition = 0;
      const courseWidth = span ? columnWidth * 2 - 20 : columnWidth - 20;
      const requiredColumns = span ? 2 : 1;

      // Find the next available row for the given columns (check both columns if spanning)
      let maxYPosition = 0;
      for (let i = 0; i < requiredColumns; i++) {
        const columnIndex = xPos - 1 + i;
        maxYPosition = Math.max(maxYPosition, columnTracker[columnIndex]);
      }

      yPosition = maxYPosition + rowHeight;

      // Update the tracker with the new yPosition for the course
      for (let i = 0; i < requiredColumns; i++) {
        const columnIndex = xPos - 1 + i;
        columnTracker[columnIndex] = yPosition + rowHeight; // Update for next course in this column
      }

      const courseGroup = svg.append('g')
        .attr('transform', `translate(${xPosition + 10}, ${yPosition})`)
        .classed(`column-${xPos}`, true);

      // Rectangle for each course
      courseGroup.append('rect')
        .attr('width', courseWidth) // Span 2 columns for Semester 3
        .attr('height', 120)
        .attr('fill', 'lightblue')
        .attr('stroke', 'black')
        .attr('id', `course-${course.z_code}`)
        .style('cursor', 'pointer') // Cursor pointer
        .on('click', () => this.highlightConnectedCourses(course.z_code, connections));

      // Text (with wrap)
      courseGroup.append('text')
        .attr('x', courseWidth / 2) // Center horizontally
        .attr('y', 120 / 2) // Center vertically
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle') // Vertical alignment
        .call(this.wrapText, columnWidth - 30, course.course_name);
    });

    // Add placeholders for missing courses (empty rectangles)
    columnMapping.forEach(mapping => {
      const phaseSemesterKey = `${mapping.phase}-${mapping.semester}`;
      const courseCount = phaseSemesterCount[phaseSemesterKey] || 0;

      if (courseCount === 0) {
        const xPos = (mapping.phase - 1) * 2 + mapping.semester;
        const xPosition = (xPos - 1) * columnWidth;
        const yPosition = (svg.selectAll(`.column-${xPos}`).size() + 1) * rowHeight;

        // Create a placeholder rectangle for missing course
        svg.append('rect')
          .attr('x', xPosition + 10)
          .attr('y', yPosition)
          .attr('width', columnWidth - 20)
          .attr('height', 60)
          .attr('fill', 'lightgray') // Placeholder color
          .attr('stroke', 'black')
          .attr('class', `empty-column-${xPos}`);
      }
    });

    // Column Labels (Phase and Semester)
    svg.selectAll('.column-label')
      .data(columnMapping)
      .enter()
      .append('text')
      .attr('x', (_, i) => i * columnWidth + columnWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .text(d => `Phase ${d.phase}, Semester ${d.semester}`)
      .attr('font-weight', 'bold');
  }

  highlightConnectedCourses(courseZCode: string, connections: Connection[]): void {
    const svg = d3.select('svg');
    // Reset all courses to default state
    svg.selectAll('g')
      .attr('fill-opacity', 1)
      .attr('filter', 'none')
      .select('rect')
      .attr('fill', 'lightblue')
      .attr('stroke-width', 1);

    // Set to track connected courses
    const allConnectedZCodes = new Set<string>();

    // Recursive function to find all connected courses
    const findConnectedCourses = (zCode: string) => {
      allConnectedZCodes.add(zCode);

      const directConnections = connections.filter(conn =>
        conn.z_code_1 === zCode || conn.z_code_2 === zCode);

      directConnections.forEach(conn => {
        const connectedCourse = conn.z_code_1 === zCode ? conn.z_code_2 : conn.z_code_1;
        if (!allConnectedZCodes.has(connectedCourse)) {
          findConnectedCourses(connectedCourse);
        }
      });
    };

    // Start the recursive search from the clicked course
    findConnectedCourses(courseZCode);

    // Highlight connected courses
    allConnectedZCodes.forEach(zCode => {
      svg.select(`#course-${zCode}`)
        .attr('fill', 'orange')
        .attr('stroke-width', 3);
    });

    // Blur non-connected courses
    svg.selectAll('g')
      .filter(function () {
        const rect = d3.select(this).select('rect');
        const id = rect.attr('id')?.replace('course-', '');
        return !allConnectedZCodes.has(id!);
      })
      .attr('fill-opacity', 0.5)
      .attr('filter', 'blur(2px)');
  }

  // Function to wrap text into multiple lines
  wrapText(text: any, width: any, name: any): void {
    const words = name.split(/\s+/); // Split words without reversing
    let line: any[] = [];
    let lineNumber = 0;
    const lineHeight = 1.2; // ems for line spacing
    const y = parseFloat(text.attr('y')); // Ensure y is a number
    const x = text.attr('x');

    text.text(null); // Clear existing text

    let tspan = text.append('tspan').attr('x', x).attr('y', y).text('');

    words.forEach((word: any) => {
      line.push(word);
      tspan.text(line.join(' '));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop(); // Remove the word that caused overflow
        tspan.text(line.join(' ')); // Update current line

        line = [word]; // Start a new line with the overflow word
        tspan = text.append('tspan')
          .attr('x', x)
          .attr('y', y + ++lineNumber * lineHeight * 16)
          .text(word); // Start new line with this word
      }
    });
  }

  createConnections(connections: Connection[]): void {
    const svg = d3.select('svg');

    connections.forEach(connection => {
      const sourceElement = svg.select(`#course-${connection.z_code_1}`);
      const targetElement = svg.select(`#course-${connection.z_code_2}`);

      if (!sourceElement.empty() && !targetElement.empty()) {
        // Get bounding boxes of source and target elements
        const sourceBBox = (sourceElement.node() as SVGGraphicsElement).getBBox();
        const targetBBox = (targetElement.node() as SVGGraphicsElement).getBBox();

        // Determine the center of the edges of the source node
        const sourceCenterX = sourceBBox.x + sourceBBox.width / 2;
        const sourceCenterY = sourceBBox.y + sourceBBox.height / 2;

        // Determine the center of the edges of the target node
        const targetCenterX = targetBBox.x + targetBBox.width / 2;
        const targetCenterY = targetBBox.y + targetBBox.height / 2;

        // Calculate closest edge on the source node (left, right, top, bottom)
        let sourceEdgeX = sourceCenterX;
        let sourceEdgeY = sourceCenterY;
        if (targetCenterX < sourceCenterX) {
          sourceEdgeX = sourceBBox.x;  // Left edge
        } else if (targetCenterX > sourceCenterX) {
          sourceEdgeX = sourceBBox.x + sourceBBox.width; // Right edge
        }
        if (targetCenterY < sourceCenterY) {
          sourceEdgeY = sourceBBox.y;  // Top edge
        } else if (targetCenterY > sourceCenterY) {
          sourceEdgeY = sourceBBox.y + sourceBBox.height; // Bottom edge
        }

        // Calculate closest edge on the target node
        let targetEdgeX = targetCenterX;
        let targetEdgeY = targetCenterY;
        if (targetCenterX < sourceCenterX) {
          targetEdgeX = targetBBox.x; // Left edge
        } else if (targetCenterX > sourceCenterX) {
          targetEdgeX = targetBBox.x + targetBBox.width; // Right edge
        }
        if (targetCenterY < sourceCenterY) {
          targetEdgeY = targetBBox.y; // Top edge
        } else if (targetCenterY > sourceCenterY) {
          targetEdgeY = targetBBox.y + targetBBox.height; // Bottom edge
        }

        // Draw the line between the edges
        svg.append('line')
          .attr('x1', sourceEdgeX)
          .attr('y1', sourceEdgeY)
          .attr('x2', targetEdgeX)
          .attr('y2', targetEdgeY)
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrow)'); // Optional arrowhead for directed connections
      }
    });
  }

  getColumnPosition(phase: number, semester: number): { xPos: number, span: boolean } {
    if (semester === 3) {
      return { xPos: (phase - 1) * 2 + 1, span: true }; // Span across columns
    }
    return { xPos: (phase - 1) * 2 + semester, span: false }; // Regular position
  }
}

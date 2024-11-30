import { Component, inject, OnInit } from '@angular/core';
import { Course } from '../course';
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
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses()  // Replace with your actual API
      .subscribe(courses => {
        this.createFlowchart(courses);
      });
  }

  createFlowchart(courses: Course[]): void {
    const svgWidth = 1800;
    const svgHeight = 1200;
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

    courses.forEach(course => {
      const columnIndex = columnMapping.findIndex(mapping =>
        mapping.phase === course.phase && mapping.semester === course.semester);

      if (columnIndex !== -1) {
        const xPosition = columnIndex * columnWidth;
        const yPosition = (svg.selectAll(`.column-${columnIndex}`).size() + 1) * rowHeight;

        // Create a rectangle for the course
        svg.append('rect')
          .attr('x', xPosition + 10)
          .attr('y', yPosition)
          .attr('width', columnWidth - 20)
          .attr('height', 60) // Adjusted height for multiline text
          .attr('fill', 'lightblue')
          .attr('stroke', 'black')
          .classed(`column-${columnIndex}`, true);

        // Add multiline text
        svg.append('text')
          .attr('x', xPosition + columnWidth / 2)
          .attr('y', yPosition + 20)
          .attr('text-anchor', 'middle')
          .call(this.wrapText, columnWidth - 30, course.course_name); // Call wrapText function
      }
    });

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

  // Function to wrap text into multiple lines
  wrapText(text: any, width: any, name: any): void {
    const words = name.split(/\s+/); // Split words without reversing
    let line : any[] = [];
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
}

import { Component, EventEmitter, inject, Input, input, OnInit, Output } from '@angular/core';
import { Course, Tag } from '../course';
import { CourseService } from '../course.service';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [NgStyle, NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  readonly courseService = inject(CourseService);
  tags: Tag[] = [];
  @Output() tagClick: EventEmitter<Tag | null> = new EventEmitter<Tag | null>();
  selectedTag: string | null = null;

  ngOnInit(): void {
    this.courseService.getTags()
      .subscribe(tags => {
        this.tags = tags;
      });
  }

  onTagClick(tag: Tag) {
    if (this.selectedTag === tag.name) {
      this.selectedTag = null;
      this.tagClick.emit(null);
    } else {
      this.selectedTag = tag.name;
      this.tagClick.emit(tag);
    }
  }

}

import { Component } from '@angular/core';
import { Fruits, Vegetables, Spices, Grains, Meat, Others, Cuisines, CourseTypes } from './data/category-data';
import { CategoryItem } from './interfaces/category.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fruits: CategoryItem[] = Fruits;
  vegetables: CategoryItem[] = Vegetables;
  spices: CategoryItem[] = Spices;
  grains: CategoryItem[] = Grains;
  meat: CategoryItem[] = Meat;
  others: CategoryItem[] = Others;
  cuisines: CategoryItem[] = Cuisines;
  courseTypes: CategoryItem[] = CourseTypes;  // Importing CourseTypes

  selectedFruits: { [key: string]: boolean } = {};
  selectedVegetables: { [key: string]: boolean } = {};
  selectedSpices: { [key: string]: boolean } = {};
  selectedGrains: { [key: string]: boolean } = {};
  selectedMeat: { [key: string]: boolean } = {};
  selectedOthers: { [key: string]: boolean } = {};

  selectedCuisine: string = 'Indian';
  selectedCourseType: string = 'maincourse'; // Default selection for course type


  // Check if at least one item is selected in each category
  canCraftRecipe(): boolean {
    return (
      this.getSelectedItems(this.selectedFruits).length > 0 &&
      this.getSelectedItems(this.selectedVegetables).length > 0 &&
      this.getSelectedItems(this.selectedSpices).length > 0 &&
      this.getSelectedItems(this.selectedGrains).length > 0 &&
      this.getSelectedItems(this.selectedMeat).length > 0 &&
      this.getSelectedItems(this.selectedOthers).length > 0
    );
  }

  getSelectedItems(category: { [key: string]: boolean }): string[] {
    return Object.keys(category).filter(item => category[item]);
  }

  removeAll(category: string): void {
    switch (category) {
      case 'fruits':
        this.selectedFruits = {};
        break;
      case 'vegetables':
        this.selectedVegetables = {};
        break;
      case 'spices':
        this.selectedSpices = {};
        break;
      case 'grains':
        this.selectedGrains = {};
        break;
      case 'meat':
        this.selectedMeat = {};
        break;
      case 'others':
        this.selectedOthers = {};
        break;
    }
  }

  selectCuisine(cuisine: string): void {
    this.selectedCuisine = cuisine;
  }
  selectCourseType(courseType: string): void {
    this.selectedCourseType = courseType;
  }
}

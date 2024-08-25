// src/app/data/category-data.ts
import { CategoryItem } from '../interfaces/category.interface';

export const Fruits: CategoryItem[] = [
  { value: 'apple', viewValue: 'Apple' },
  { value: 'banana', viewValue: 'Banana' },
  { value: 'orange', viewValue: 'Orange' },
  // Add more fruits as needed
];

export const Vegetables: CategoryItem[] = [
  { value: 'carrot', viewValue: 'Carrot' },
  { value: 'broccoli', viewValue: 'Broccoli' },
  { value: 'spinach', viewValue: 'Spinach' },
  // Add more vegetables as needed
];

export const Spices: CategoryItem[] = [
  { value: 'salt', viewValue: 'Salt' },
  { value: 'pepper', viewValue: 'Pepper' },
  { value: 'cumin', viewValue: 'Cumin' },
  // Add more spices as needed
];

export const Grains: CategoryItem[] = [
  { value: 'rice', viewValue: 'Rice' },
  { value: 'wheat', viewValue: 'Wheat' },
  { value: 'barley', viewValue: 'Barley' },
  // Add more grains as needed
];

export const Meat: CategoryItem[] = [
  { value: 'chicken', viewValue: 'Chicken' },
  { value: 'beef', viewValue: 'Beef' },
  { value: 'pork', viewValue: 'Pork' },
  // Add more meats as needed
];

export const Others: CategoryItem[] = [
  { value: 'rice', viewValue: 'Rice' },
  { value: 'pasta', viewValue: 'Pasta' },
  { value: 'beans', viewValue: 'Beans' },
  // Add more items as needed
];

export const Cuisines: CategoryItem[] = [
  { value: 'indian', viewValue: 'Indian' },
  { value: 'american', viewValue: 'American' },
  { value: 'french', viewValue: 'French' },
  { value: 'chinese', viewValue: 'Chinese' },
  { value: 'italian', viewValue: 'Italian' },
  // Add more cuisines as needed
];

// New Course Types Category
export const CourseTypes: CategoryItem[] = [
  { value: 'maincourse', viewValue: 'Main Course' },
  { value: 'dessert', viewValue: 'Dessert' },
  { value: 'appetizer', viewValue: 'Appetizer' },
  { value: 'side', viewValue: 'Side Dish' }
];

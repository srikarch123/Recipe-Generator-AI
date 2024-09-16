import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fruits, Vegetables, Spices, Grains, legumes, Meat, Dairy, Cuisines, CourseTypes } from './data/category-data';
import { CategoryItem } from './interfaces/category.interface';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private apiUrl = environment.apiUrl;

  //Animation
  isLoading = false; 
  
  // Initialize the category arrays
  fruits: CategoryItem[] = Fruits;
  vegetables: CategoryItem[] = Vegetables;
  spices: CategoryItem[] = Spices;
  grains: CategoryItem[] = Grains;
  legumes: CategoryItem[] = legumes;
  meat: CategoryItem[] = Meat;
  dairy: CategoryItem[] = Dairy;
  cuisines: CategoryItem[] = Cuisines;
  courseTypes: CategoryItem[] = CourseTypes;

  // Initialize selected items and default selections
  selectedFruits: { [key: string]: boolean } = {};
  selectedVegetables: { [key: string]: boolean } = {};
  selectedSpices: { [key: string]: boolean } = {};
  selectedGrains: { [key: string]: boolean } = {};
  selectedLegumes:{ [key: string]: boolean } = {};
  selectedMeat: { [key: string]: boolean } = {};
  selectedDairy: { [key: string]: boolean } = {};

  selectedCuisine: string = 'Indian';
  selectedCourseType: string = 'maincourse'; // Default selection for course type

  recipe: string = '';  // Variable to hold the generated recipe
  recipeTitle: string | undefined;
  recipeIngredients: string[] | undefined;
  recipeInstructions: string[] | undefined;
  recipeTips: string[] | undefined;

  constructor(private http: HttpClient) {}

  // Method to check if at least one item is selected in each category
  canCraftRecipe(): boolean {
    return (
      //this.getSelectedItems(this.selectedFruits).length > 0 &&
      this.getSelectedItems(this.selectedSpices).length > 0 //&&
      //this.getSelectedItems(this.selectedGrains).length > 0
      //this.getSelectedItems(this.selectedMeat).length > 0
    );
  }

  // Method to get selected items from a category
  getSelectedItems(category: { [key: string]: boolean }): string[] {
    return Object.keys(category).filter(item => category[item]);
  }

  // Method to remove all selections from a category
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
      case 'legumes':
        this.selectedLegumes ={};
        break;
      case 'meat':
        this.selectedMeat = {};
        break;
      case 'Dairy':
        this.selectedDairy = {};
        break;
    }
  }

  // Method to select a cuisine
  selectCuisine(cuisine: string): void {
    this.selectedCuisine = cuisine;
  }

  // Method to select a course type
  selectCourseType(courseType: string): void {
    this.selectedCourseType = courseType;
  }

  // Method to craft a recipe by sending selected items to the backend
  craftRecipe() {

    this.isLoading = true;  // Start loading

    const ingredients = [
      ...this.getSelectedItems(this.selectedFruits),
      ...this.getSelectedItems(this.selectedVegetables),
      ...this.getSelectedItems(this.selectedSpices),
      ...this.getSelectedItems(this.selectedGrains),
      ...this.getSelectedItems(this.selectedLegumes),
      ...this.getSelectedItems(this.selectedMeat),
      ...this.getSelectedItems(this.selectedDairy)
    ];
  
    const requestBody = {
      ingredients,
      cuisine: this.selectedCuisine,
      course_type: this.selectedCourseType
    };
  
    this.http.post<any>(`${this.apiUrl}/generate_recipe`, requestBody)
      .subscribe(response => {
        this.parseRecipe(response.recipe);
        this.isLoading = false;  // Stop loading after the recipe is successfully generated
      }, error => {
        console.error('Error generating recipe:', error);
        this.isLoading = false;  // Stop loading even if there's an error
      });
  }
  
  parseRecipe(rawRecipe: string) {
    // Adjust the regular expression patterns to match the format in the provided string
    const titleMatch = rawRecipe.match(/^\*\*Title:\*\*\s*(.*?)\n/);
    const ingredientsMatch = rawRecipe.match(/\*\*Recipe Ingredients:\*\*(.*?)\*\*Instructions:/s);
    const instructionsMatch = rawRecipe.match(/\*\*Instructions:\*\*(.*?)\*\*Tips:/s);
    const tipsMatch = rawRecipe.match(/\*\*Tips:\*\*(.*)/s);

    // Extract and assign the title
    this.recipeTitle = titleMatch ? titleMatch[1].trim() : 'Generated Recipe';

    // Extract and assign the ingredients list, cleaning up any extra formatting characters
    if (ingredientsMatch) {
        this.recipeIngredients = ingredientsMatch[1].trim().split('\n').map(i => i.replace(/^\* /, '').trim()).filter(i => i);
    } else {
        this.recipeIngredients = [];
    }

    // Extract and assign the instructions, splitting by numbers (1., 2., etc.)
    if (instructionsMatch) {
        this.recipeInstructions = instructionsMatch[1].trim().split(/\d+\.\s+/).filter(i => i);
    } else {
        this.recipeInstructions = [];
    }

    // Extract and assign the tips, cleaning up any extra formatting characters
    if (tipsMatch) {
        this.recipeTips = tipsMatch[1].trim().split('\n').map(i => i.replace(/^\* /, '').trim()).filter(i => i);
    } else {
        this.recipeTips = [];
    }
}

  
}

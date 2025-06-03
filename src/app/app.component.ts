import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fruits, Vegetables, Spices, Grains, legumes, Meat, Dairy, Cuisines, CourseTypes } from './data/category-data';
import { CategoryItem } from './interfaces/category.interface';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private apiUrl = environment.apiUrl;

  // Animation and UI state
  isLoading = false;
  mobileMenuOpen = false;
  activeDropdown: string | null = null;
  loadingStep = 1;
  
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
  selectedLegumes: { [key: string]: boolean } = {};
  selectedMeat: { [key: string]: boolean } = {};
  selectedDairy: { [key: string]: boolean } = {};

  selectedCuisine: string = 'Indian';
  selectedCourseType: string = 'maincourse'; // Default selection for course type

  recipe: string = '';  // Variable to hold the generated recipe
  recipeTitle: string | undefined;
  recipeIngredients: string[] | undefined;
  recipeInstructions: string[] | undefined;
  recipeTips: string[] | undefined;

  // 🎮 INTERACTIVE PARTICLES PROPERTIES
  particleScore: number = 0;
  particleCombo: number = 0;
  showScore: boolean = false;
  showCombo: boolean = false;
  comboText: string = '';
  currentScore: string = '';
  private mouseX: number = 0;
  private mouseY: number = 0;
  private lastClickTime: number = 0;
  private mouseMoveListener?: () => void;
  private konamiCode: string[] = [];
  private readonly konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown','ArrowDown', 'ArrowLeft'];
  superModeActive: boolean = false;

  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  // 🎮 LIFECYCLE HOOKS FOR PARTICLES
  ngOnInit() {
    this.initializeInteractiveParticles();
  }

  ngOnDestroy() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }

  // 🎮 INTERACTIVE PARTICLES METHODS
  initializeInteractiveParticles() {
    // Mouse movement tracking
    this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.applyMagnetEffect();
    });

    // Keyboard listener for Konami code
    this.renderer.listen('document', 'keydown', (e: KeyboardEvent) => {
      this.handleKonamiCode(e.code);
    });

    // Initialize particles after view loads
    setTimeout(() => {
      this.setupParticleClickListeners();
      this.randomizeGoldenParticles();
    }, 500);
  }

  applyMagnetEffect() {
    const particles = this.el.nativeElement.querySelectorAll('.food-particle');
    particles.forEach((particle: HTMLElement) => {
      const rect = particle.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(this.mouseX - particleX, 2) + Math.pow(this.mouseY - particleY, 2)
      );

      if (distance < 100) {
        const attraction = Math.max(0, (100 - distance) / 100);
        const deltaX = (this.mouseX - particleX) * attraction * 0.3;
        const deltaY = (this.mouseY - particleY) * attraction * 0.3;

        this.renderer.addClass(particle, 'attracted');
        this.renderer.setStyle(particle, 'transform', 
          `translate(${deltaX}px, ${deltaY}px) scale(${1 + attraction * 0.5})`);
      } else {
        this.renderer.removeClass(particle, 'attracted');
        this.renderer.removeStyle(particle, 'transform');
      }
    });
  }

  setupParticleClickListeners() {
    const particles = this.el.nativeElement.querySelectorAll('.food-particle');
    particles.forEach((particle: HTMLElement) => {
      
      // Click event
      this.renderer.listen(particle, 'click', (e: MouseEvent) => {
        this.onParticleClick(e, particle);
      });

      // Hover events
      this.renderer.listen(particle, 'mouseenter', () => {
        if (!particle.classList.contains('clicked')) {
          this.renderer.setStyle(particle, 'animation', 
            particle.style.animation + ', bounce 0.3s ease');
        }
      });
    });
  }

  onParticleClick(event: MouseEvent, particle: HTMLElement) {
    event.preventDefault();
    event.stopPropagation();

    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastClickTime;

    // Combo system
    if (timeDiff < 1000) {
      this.particleCombo++;
    } else {
      this.particleCombo = 1;
    }
    this.lastClickTime = currentTime;

    // Calculate score
    const isGolden = particle.classList.contains('golden');
    let points = isGolden ? 50 : 10;
    if (this.particleCombo > 1) points *= this.particleCombo;

    this.particleScore += points;

    // Show effects
    this.showScoreEffect(points, isGolden);
    if (this.particleCombo > 2) {
      this.showComboEffect();
    }

    // Visual effects
    this.createParticleExplosion(event.clientX, event.clientY, isGolden);
    this.renderer.addClass(particle, 'clicked');

    // Respawn particle
    setTimeout(() => {
      this.respawnParticle(particle);
    }, 2000 + Math.random() * 3000);
  }

  showScoreEffect(points: number, isGolden: boolean) {
    this.currentScore = `+${points}${isGolden ? ' ✨' : ''}`;
    this.showScore = true;
    
    setTimeout(() => {
      this.showScore = false;
    }, 1500);
  }

  showComboEffect() {
    this.comboText = `${this.particleCombo}x COMBO! 🔥`;
    this.showCombo = true;
    
    setTimeout(() => {
      this.showCombo = false;
    }, 2000);
  }

  createParticleExplosion(x: number, y: number, isGolden: boolean) {
    const burstContainer = this.renderer.createElement('div');
    this.renderer.addClass(burstContainer, 'particle-burst');
    this.renderer.setStyle(burstContainer, 'left', x + 'px');
    this.renderer.setStyle(burstContainer, 'top', y + 'px');
    this.renderer.setStyle(burstContainer, 'position', 'fixed');
    this.renderer.setStyle(burstContainer, 'pointer-events', 'none');
    this.renderer.setStyle(burstContainer, 'z-index', '1000');
    this.renderer.appendChild(document.body, burstContainer);

    // Create burst particles
    const particleCount = isGolden ? 12 : 8;
    for (let i = 0; i < particleCount; i++) {
      const burstParticle = this.renderer.createElement('div');
      this.renderer.addClass(burstParticle, 'burst-particle');

      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 30 + Math.random() * 40;
      const burstX = Math.cos(angle) * distance;
      const burstY = Math.sin(angle) * distance;

      this.renderer.setStyle(burstParticle, '--burst-x', burstX + 'px');
      this.renderer.setStyle(burstParticle, '--burst-y', burstY + 'px');

      if (isGolden) {
        this.renderer.setStyle(burstParticle, 'background', 'gold');
        this.renderer.setStyle(burstParticle, 'box-shadow', '0 0 10px gold');
      }

      this.renderer.appendChild(burstContainer, burstParticle);
    }

    // Remove explosion after animation
    setTimeout(() => {
      if (document.body.contains(burstContainer)) {
        this.renderer.removeChild(document.body, burstContainer);
      }
    }, 1000);
  }

  respawnParticle(particle: HTMLElement) {
    this.renderer.removeClass(particle, 'clicked');
    this.renderer.removeClass(particle, 'golden');
    this.renderer.removeStyle(particle, 'transform');
    
    // Random new position
    this.renderer.setStyle(particle, 'left', Math.random() * 90 + '%');

    // Chance for golden particle
    if (Math.random() < (this.superModeActive ? 0.7 : 0.15)) {
      this.renderer.addClass(particle, 'golden');
    }
  }

  randomizeGoldenParticles() {
    const particles = this.el.nativeElement.querySelectorAll('.food-particle');
    particles.forEach((particle: HTMLElement) => {
      if (Math.random() < 0.1) {
        this.renderer.addClass(particle, 'golden');
      }
    });
  }

  handleKonamiCode(code: string) {
    this.konamiCode.push(code);
    if (this.konamiCode.length > this.konami.length) {
      this.konamiCode.shift();
    }

    if (this.konamiCode.join(',') === this.konami.join(',')) {
      this.activateSuperMode();
      this.konamiCode = [];
    }
  }

  activateSuperMode() {
    this.superModeActive = true;
    
    // Make all particles golden
    const particles = this.el.nativeElement.querySelectorAll('.food-particle');
    particles.forEach((particle: HTMLElement) => {
      this.renderer.addClass(particle, 'golden');
    });

    // Show super mode notification
    this.comboText = '🌟 SUPER MODE ACTIVATED! 🌟';
    this.showCombo = true;

    setTimeout(() => {
      this.showCombo = false;
      this.superModeActive = false;
      
      // Remove golden effect after 10 seconds
      setTimeout(() => {
        particles.forEach((particle: HTMLElement) => {
          if (Math.random() > 0.3) {
            this.renderer.removeClass(particle, 'golden');
          }
        });
      }, 10000);
    }, 3000);
  }

  // Reset particle game
  resetParticleGame() {
    this.particleScore = 0;
    this.particleCombo = 0;
    this.showScore = false;
    this.showCombo = false;
    this.superModeActive = false;
    this.randomizeGoldenParticles();
  }

  // 🍳 LOADING MESSAGES - Extended 10-second experience
  getLoadingMessage(): string {
    const messages = [
      "🔍 Scanning your selected ingredients...",
      "🧠 AI analyzing flavor profiles and combinations...", 
      "🌶️ Balancing spices and seasonings perfectly...",
      "👨‍🍳 Our master chef AI is designing your dish...",
      "🍳 Calculating optimal cooking techniques...",
      "✨ Adding final touches and presentation tips...",
      "🎯 Your personalized recipe is almost ready!"
    ];
    
    const index = Math.min(this.loadingStep - 1, messages.length - 1);
    return messages[index] || messages[0];
  }

  // 🍽️ ORIGINAL UI METHODS (unchanged)
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setActiveDropdown(dropdown: string): void {
    this.activeDropdown = dropdown;
  }

  clearActiveDropdown(): void {
    this.activeDropdown = null;
  }

  hasAnySelections(): boolean {
    return this.getSelectedItems(this.selectedFruits).length > 0 ||
           this.getSelectedItems(this.selectedVegetables).length > 0 ||
           this.getSelectedItems(this.selectedSpices).length > 0 ||
           this.getSelectedItems(this.selectedGrains).length > 0 ||
           this.getSelectedItems(this.selectedLegumes).length > 0 ||
           this.getSelectedItems(this.selectedMeat).length > 0 ||
           this.getSelectedItems(this.selectedDairy).length > 0;
  }

  getTotalSelectedCount(): number {
    return this.getSelectedItems(this.selectedFruits).length +
           this.getSelectedItems(this.selectedVegetables).length +
           this.getSelectedItems(this.selectedSpices).length +
           this.getSelectedItems(this.selectedGrains).length +
           this.getSelectedItems(this.selectedLegumes).length +
           this.getSelectedItems(this.selectedMeat).length +
           this.getSelectedItems(this.selectedDairy).length;
  }

  getRandomIngredients(): string[] {
    const allIngredients = [
      '🍎', '🥕', '🌶️', '🌾', '🫘', '🥩', '🧀', '🍅', '🥬', '🧄',
      '🧅', '🥔', '🌽', '🥒', '🍋', '🥑', '🍯', '🥥', '🫒', '🍄'
    ];
    return allIngredients.slice(0, 8);
  }

  resetRecipe(): void {
    this.recipeTitle = undefined;
    this.recipeIngredients = undefined;
    this.recipeInstructions = undefined;
    this.recipeTips = undefined;
  }

  shareRecipe(): void {
    if (this.recipeTitle) {
      const recipeText = `Check out this amazing ${this.selectedCuisine} recipe: ${this.recipeTitle}!`;
      if (navigator.share) {
        navigator.share({
          title: this.recipeTitle,
          text: recipeText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(recipeText).then(() => {
          alert('Recipe copied to clipboard!');
        });
      }
    }
  }

  // Original Methods (unchanged)
  toggleCheckbox(value: string, type: 'grains' | 'legumes' | 'fruits' | 'vegetables' | 'spices' | 'meat' | 'dairy'): void {
    switch (type) {
      case 'grains':
        this.selectedGrains[value] = !this.selectedGrains[value];
        break;
      case 'legumes':
        this.selectedLegumes[value] = !this.selectedLegumes[value];
        break;
      case 'fruits':
        this.selectedFruits[value] = !this.selectedFruits[value];
        break;
      case 'vegetables':
        this.selectedVegetables[value] = !this.selectedVegetables[value];
        break;
      case 'spices':
        this.selectedSpices[value] = !this.selectedSpices[value];
        break;
      case 'meat':
        this.selectedMeat[value] = !this.selectedMeat[value];
        break;
      case 'dairy':
        this.selectedDairy[value] = !this.selectedDairy[value];
        break;
    }
  }

  canCraftRecipe(): boolean {
    return (
      this.getSelectedItems(this.selectedFruits).length > 0 ||
      this.getSelectedItems(this.selectedSpices).length > 0 ||
      this.getSelectedItems(this.selectedGrains).length > 0 ||
      this.getSelectedItems(this.selectedLegumes).length > 0 ||
      this.getSelectedItems(this.selectedVegetables).length > 0 ||
      this.getSelectedItems(this.selectedMeat).length > 0 ||
      this.getSelectedItems(this.selectedDairy).length > 0
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
      case 'legumes':
        this.selectedLegumes = {};
        break;
      case 'meat':
        this.selectedMeat = {};
        break;
      case 'Dairy':
        this.selectedDairy = {};
        break;
    }
  }

  selectCuisine(cuisine: string): void {
    this.selectedCuisine = cuisine;
  }

  selectCourseType(courseType: string): void {
    this.selectedCourseType = courseType;
  }

  craftRecipe() {
    this.isLoading = true;
    this.loadingStep = 1;

    // Extended 10-second loading with more detailed steps
    const stepInterval = setInterval(() => {
      this.loadingStep++;
      if (this.loadingStep > 8) {
        clearInterval(stepInterval);
      }
    }, 1250); // 8 steps × 1.25 seconds = 10 seconds

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

    // Minimum 10-second loading experience
    const startTime = Date.now();
    
    this.http.post<any>(`${this.apiUrl}/generate_recipe`, requestBody)
      .subscribe(response => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 10000 - elapsedTime); // Ensure minimum 10 seconds
        
        setTimeout(() => {
          this.parseRecipe(response.recipe);
          this.isLoading = false;
          this.loadingStep = 1; // Reset for next use
          clearInterval(stepInterval);
        }, remainingTime);
      }, error => {
        console.error('Error generating recipe:', error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 10000 - elapsedTime);
        
        setTimeout(() => {
          this.isLoading = false;
          this.loadingStep = 1; // Reset for next use
          clearInterval(stepInterval);
        }, remainingTime);
      });
  }

  parseRecipe(rawRecipe: string) {
    const titleMatch = rawRecipe.match(/\*\*Title:\*\*\s*(.+?)(\n|\r|$)/);
    this.recipeTitle = titleMatch ? titleMatch[1].trim() : 'Generated Recipe';

    const ingredientsMatch = rawRecipe.match(/\*\*Recipe Ingredients:\*\*\s*([\s\S]*?)\*\*Instructions:/);
    if (ingredientsMatch) {
        this.recipeIngredients = ingredientsMatch[1]
            .trim()
            .split('\n')
            .map(i => i.replace(/^\* /, '').trim())
            .filter(i => i && !/^\d+\.$/.test(i));
    } else {
        this.recipeIngredients = [];
    }

    const instructionsMatch = rawRecipe.match(/\*\*Instructions:\*\*\s*([\s\S]*?)(\*\*Tips:|\*\*End)/);
    if (instructionsMatch) {
        this.recipeInstructions = instructionsMatch[1]
            .trim()
            .split(/\d+\.\s+/)
            .filter(i => i);
    } else {
        this.recipeInstructions = [];
    }

    const tipsMatch = rawRecipe.match(/\*\*Tips:\*\*\s*([\s\S]*)/);
    if (tipsMatch) {
        this.recipeTips = tipsMatch[1]
            .trim()
            .split('\n')
            .map(i => i.replace(/^\* /, '').trim())
            .filter(i => i);
    } else {
        this.recipeTips = [];
    }
  }
}
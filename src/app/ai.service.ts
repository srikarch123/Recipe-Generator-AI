// src/app/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:5000/generate-recipe';  // Adjust the URL if necessary

  constructor(private http: HttpClient) {}

  generateRecipe(ingredients: string[], cuisine: string): Observable<any> {
    return this.http.post(this.apiUrl, { ingredients, cuisine });
  }
}

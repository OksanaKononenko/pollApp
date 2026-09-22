import { Injectable } from "@angular/core";


/**
 * Варіант відповіді в опитуванні
 */
export interface Option {
  id: string;        // Унікальний ідентифікатор варіанта (опціональний при створенні нового)
  text: string;       // Текст варіанта відповіді
  votes?: number;     // Кількість голосів за цей варіант
}

/**
 * Основна модель опитування
 */
 
export interface PollOption {
  id?: string;
  text: string;
  votes?: number;
  percentage?: number;
}


export interface Poll {
  id?: string;
  publicId?: string;
  question?: string; 
  options?: PollOption[];
  totalVotes?: number;
  hasVoted?: boolean;
  selectedOptionId?: string;
  createdAt?: string;
}
/**
 * Модель результатів опитування для побудови діаграми
 */
export interface PollResult {
  pollId: string;
  question: string;
  totalVotes: number;
  results: {
    optionId: string;
    text: string;
    votesCount: number; // Кількість голосів
    percentage: number; // Відсоток від загальної кількості
  }[];
}

/**
 * Елемент історії пройдених опитувань користувача
 */
export interface UserPollHistory {
  pollId: string;     // ID опитування
  pollTitle: string;  // Назва опитування
  votedAt: string;    // Дата та час голосування
  selectedOptionId: string; // Обраний варіант відповіді
}
//  ---------------------------------

export interface Survey  {
 id: string;
   question: string; 
 options: Option[];  // Список варіантів відповідей


}


@Injectable({
providedIn: 'root'
})

export class SurveyService {

}
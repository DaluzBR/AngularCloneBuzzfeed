import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import quizz_questions from '../../../assets/data/quizz_questions.json'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})

export class QuizComponent implements OnInit {

  title: string = ''
  questions: any
  questionSelected: any
  answers: string[] = []
  answerSelected: string = ''
  questionIndex: number = 0
  questionMaxIndex: number = 0;
  finished: boolean = false

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    if (quizz_questions) {
      this.loadQuiz()
    }
  }


  /** Calcula o perfil de resposta mais frequênte. */
  async checkResult(answers: string[]) {
    return answers.reduce((previous, current, index, arr) => {
      if (
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ) {
        return previous
      } else {
        return current
      }
    })
  }

  /**
   * Recebe a escolha do usuário e passa para a nova pergunta, se ouver.
   * @param value Recebe a escolha do usuuário.
   */
  playerChoose(value: string) {
    this.answers.push(value)
    this.nextStep()
  }

  /**
   * Emcaminha o quiz para a próxima pergunta até o final das questões.
   */
  async nextStep() {
    this.questionIndex++

    if (this.questionIndex < this.questionMaxIndex) {
      this.questionSelected = this.questions[this.questionIndex]
    } else {
      this.finished = true

      const finalAnswer: string = await this.checkResult(this.answers)
      this.answerSelected = quizz_questions.results[
        finalAnswer as keyof typeof quizz_questions.results
      ]
    }
  }

  /**
   * Inicializa as váriaveis do quiz.
   */
  loadQuiz() {
    this.finished = false
    this.title = quizz_questions.title
    this.questions = quizz_questions.questions
    this.questionSelected = this.questions[this.questionIndex]
    this.questionIndex = 0
    this.questionMaxIndex = this.questions.length
  }

  /**
   * Reinicia o quiz.
   */
  resetQuiz() {
    this.title = ''
    this.questions = {}
    this.questionSelected = {}
    this.answers = []
    this.answerSelected = ''
    this.questionIndex = 0
    this.questionMaxIndex = 0;
    this.finished = false

    this.router.navigate(['/'])

    this.loadQuiz()
  }
}

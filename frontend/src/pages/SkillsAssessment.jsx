import { useState } from 'react'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

export default function SkillsAssessment() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const assessments = {
    javascript: {
      name: 'JavaScript',
      questions: [
        {
          question: 'What is the output of: console.log(typeof null)?',
          options: ['null', 'undefined', 'object', 'number'],
          correct: 2
        },
        {
          question: 'Which method is used to add elements to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correct: 0
        },
        {
          question: 'What does "===" operator do?',
          options: ['Assigns value', 'Compares value only', 'Compares value and type', 'None'],
          correct: 2
        },
        {
          question: 'What is a closure in JavaScript?',
          options: [
            'A function that returns another function',
            'A function with access to outer scope',
            'A way to close the browser',
            'A loop structure'
          ],
          correct: 1
        },
        {
          question: 'Which is NOT a JavaScript data type?',
          options: ['String', 'Boolean', 'Float', 'Symbol'],
          correct: 2
        }
      ]
    },
    python: {
      name: 'Python',
      questions: [
        {
          question: 'What is the output of: print(type([]))?',
          options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
          correct: 1
        },
        {
          question: 'Which keyword is used to create a function in Python?',
          options: ['function', 'def', 'func', 'define'],
          correct: 1
        },
        {
          question: 'What does "self" represent in Python classes?',
          options: ['The class itself', 'The instance of the class', 'A static variable', 'None'],
          correct: 1
        },
        {
          question: 'Which method is used to add an element to a list?',
          options: ['add()', 'append()', 'insert()', 'push()'],
          correct: 1
        },
        {
          question: 'What is a decorator in Python?',
          options: [
            'A design pattern',
            'A function that modifies another function',
            'A class method',
            'A variable type'
          ],
          correct: 1
        }
      ]
    },
    react: {
      name: 'React',
      questions: [
        {
          question: 'What is JSX?',
          options: [
            'JavaScript XML',
            'Java Syntax Extension',
            'JSON Extension',
            'JavaScript Extension'
          ],
          correct: 0
        },
        {
          question: 'Which hook is used for side effects?',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          correct: 1
        },
        {
          question: 'What is the virtual DOM?',
          options: [
            'A copy of the real DOM',
            'A lightweight representation of the DOM',
            'A database',
            'A server'
          ],
          correct: 1
        },
        {
          question: 'How do you pass data from parent to child?',
          options: ['State', 'Props', 'Context', 'Redux'],
          correct: 1
        },
        {
          question: 'What is the purpose of keys in React lists?',
          options: [
            'Styling',
            'Identifying elements uniquely',
            'Security',
            'Performance only'
          ],
          correct: 1
        }
      ]
    }
  }

  const skills = Object.keys(assessments)

  const startAssessment = (skill) => {
    setSelectedSkill(skill)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  const handleAnswer = (answerIndex) => {
    setAnswers({ ...answers, [currentQuestion]: answerIndex })
  }

  const nextQuestion = () => {
    if (currentQuestion < assessments[selectedSkill].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    const questions = assessments[selectedSkill].questions
    let correct = 0
    
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correct++
      }
    })

    const percentage = (correct / questions.length) * 100
    setScore(percentage)
    setShowResults(true)
    
    if (percentage >= 80) {
      toast.success('Excellent performance!')
    } else if (percentage >= 60) {
      toast.success('Good job!')
    } else {
      toast('Keep practicing!')
    }
  }

  if (!selectedSkill) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Skills Assessment</h1>
          <p className="text-gray-600 mb-8">
            Test your knowledge and get certified in various technical skills
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2 capitalize">{assessments[skill].name}</h3>
                <p className="text-gray-600 mb-4">
                  {assessments[skill].questions.length} questions
                </p>
                <button
                  onClick={() => startAssessment(skill)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Start Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (showResults) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Assessment Complete!</h2>
            <div className={`text-6xl font-bold mb-4 ${
              score >= 80 ? 'text-green-600' :
              score >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {score.toFixed(0)}%
            </div>
            <p className="text-xl text-gray-700 mb-6">
              {score >= 80 ? 'Excellent! You have strong knowledge in ' :
               score >= 60 ? 'Good job! You have decent knowledge in ' :
               'Keep learning! Practice more in '}
              {assessments[selectedSkill].name}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Performance Breakdown:</h3>
              <p className="text-gray-600">
                Correct: {Math.round(score / 20)} / {assessments[selectedSkill].questions.length}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => startAssessment(selectedSkill)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => setSelectedSkill(null)}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                Choose Another Skill
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const question = assessments[selectedSkill].questions[currentQuestion]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{assessments[selectedSkill].name} Assessment</h2>
              <span className="text-gray-600">
                Question {currentQuestion + 1} / {assessments[selectedSkill].questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / assessments[selectedSkill].questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    answers[currentQuestion] === idx
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {currentQuestion === assessments[selectedSkill].questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

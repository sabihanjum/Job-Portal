class InterviewQuestionGenerator:
    def __init__(self):
        self.technical_templates = {
            'python': [
                "Explain the difference between lists and tuples in Python.",
                "How do you handle exceptions in Python?",
                "What are decorators and how do you use them?",
            ],
            'javascript': [
                "Explain closures in JavaScript.",
                "What is the difference between let, const, and var?",
                "How does async/await work?",
            ],
            'react': [
                "Explain the component lifecycle in React.",
                "What are React hooks and why are they useful?",
                "How do you manage state in a React application?",
            ],
        }
        
        self.behavioral_questions = [
            "Tell me about a time when you had to debug a complex issue.",
            "Describe a situation where you disagreed with a team member.",
            "How do you stay updated with new technologies?",
            "Tell me about your most challenging project.",
        ]
    
    def generate_questions(self, job_skills, experience_level='mid'):
        """Generate interview questions based on job requirements"""
        questions = []
        
        # Technical questions
        for skill in job_skills[:5]:
            skill_lower = skill.lower()
            if skill_lower in self.technical_templates:
                questions.extend([
                    {'type': 'technical', 'skill': skill, 'question': q}
                    for q in self.technical_templates[skill_lower][:2]
                ])
            else:
                questions.append({
                    'type': 'technical',
                    'skill': skill,
                    'question': f"Describe your experience with {skill} and provide a specific example."
                })
        
        # Behavioral questions
        for q in self.behavioral_questions[:4]:
            questions.append({'type': 'behavioral', 'question': q})
        
        return questions

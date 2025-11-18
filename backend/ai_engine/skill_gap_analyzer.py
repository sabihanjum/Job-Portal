class SkillGapAnalyzer:
    def __init__(self):
        self.learning_resources = {
            'python': {
                'beginner': [
                    {'name': 'Python for Everybody', 'platform': 'Coursera', 'duration': '8 weeks'},
                    {'name': 'Learn Python', 'platform': 'Codecademy', 'duration': '25 hours'},
                ],
                'intermediate': [
                    {'name': 'Python Beyond Basics', 'platform': 'Pluralsight', 'duration': '5 hours'},
                ],
            },
            'javascript': {
                'beginner': [
                    {'name': 'JavaScript Basics', 'platform': 'freeCodeCamp', 'duration': '300 hours'},
                ],
            },
            'react': {
                'beginner': [
                    {'name': 'React - The Complete Guide', 'platform': 'Udemy', 'duration': '40 hours'},
                ],
            },
        }
    
    def generate_learning_path(self, missing_skills, current_level='beginner'):
        """Generate personalized learning path"""
        learning_path = []
        
        for skill in missing_skills:
            skill_lower = skill.lower()
            
            if skill_lower in self.learning_resources:
                resources = self.learning_resources[skill_lower].get(current_level, [])
                for resource in resources:
                    learning_path.append({
                        'skill': skill,
                        'level': current_level,
                        **resource
                    })
            else:
                # Generic recommendation
                learning_path.append({
                    'skill': skill,
                    'level': current_level,
                    'name': f'{skill} Tutorial',
                    'platform': 'YouTube/Google',
                    'duration': 'Varies'
                })
        
        return learning_path

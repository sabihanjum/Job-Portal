import re

class BiasDetector:
    def __init__(self):
        self.gendered_words = {
            'male': ['he', 'him', 'his', 'guys', 'ninja', 'rockstar', 'dominant', 'competitive'],
            'female': ['she', 'her', 'hers', 'nurturing', 'supportive']
        }
        
        self.age_bias_words = ['young', 'energetic', 'digital native', 'recent graduate']
        
        self.exclusionary_words = ['native speaker', 'culture fit', 'aggressive']
    
    def detect_bias(self, text):
        """Detect biased language in job descriptions"""
        text_lower = text.lower()
        issues = []
        
        # Check for gendered language
        for gender, words in self.gendered_words.items():
            for word in words:
                if word in text_lower:
                    issues.append({
                        'type': 'gender_bias',
                        'word': word,
                        'gender': gender,
                        'suggestion': f"Replace '{word}' with gender-neutral language"
                    })
        
        # Check for age bias
        for word in self.age_bias_words:
            if word in text_lower:
                issues.append({
                    'type': 'age_bias',
                    'word': word,
                    'suggestion': f"'{word}' may exclude older candidates"
                })
        
        # Check for exclusionary language
        for word in self.exclusionary_words:
            if word in text_lower:
                issues.append({
                    'type': 'exclusionary',
                    'word': word,
                    'suggestion': f"'{word}' may be exclusionary"
                })
        
        return {
            'has_bias': len(issues) > 0,
            'bias_count': len(issues),
            'issues': issues
        }

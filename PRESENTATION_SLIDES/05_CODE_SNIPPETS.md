# SLIDE 5: KEY CODE SNIPPETS

## Important Code Examples

---

## 1. AI Semantic Matching (Python)
```python
from sentence_transformers import SentenceTransformer, util

class SemanticMatcher:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def match_resume_to_job(self, resume_data, job_data):
        # Prepare texts
        resume_text = self._prepare_resume_text(resume_data)
        job_text = self._prepare_job_text(job_data)
        
        # Compute embeddings
        resume_embedding = self.model.encode(resume_text)
        job_embedding = self.model.encode(job_text)
        
        # Calculate similarity
        similarity = util.cos_sim(resume_embedding, job_embedding)
        match_percentage = round(similarity.item() * 100, 2)
        
        return {
            'match_percentage': match_percentage,
            'matched_skills': matched_skills,
            'missing_skills': missing_skills
        }
```

**Highlight:** Uses state-of-the-art NLP for intelligent matching

---

## 2. Resume Parsing (Python)
```python
import spacy
import PyMuPDF

def parse_resume(file_path):
    # Extract text from PDF
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    # NLP processing
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    
    # Extract entities
    skills = extract_skills(doc)
    experience = extract_experience(doc)
    education = extract_education(doc)
    
    return {
        'skills': skills,
        'experience': experience,
        'education': education
    }
```

**Highlight:** Automated information extraction using NLP

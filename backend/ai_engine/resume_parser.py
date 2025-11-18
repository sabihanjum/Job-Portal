import re
import os
import fitz  # PyMuPDF
from docx import Document
import spacy

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except:
            self.nlp = None
    
    def parse_resume(self, file_path):
        """Parse resume and extract structured data"""
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.pdf':
            text = self._extract_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            text = self._extract_docx(file_path)
        else:
            # Try OCR for images
            text = self._extract_with_ocr(file_path)
        
        return self._extract_information(text)
    
    def _extract_pdf(self, file_path):
        """Extract text from PDF"""
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    
    def _extract_docx(self, file_path):
        """Extract text from DOCX"""
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    
    def _extract_with_ocr(self, file_path):
        """Extract text using OCR (Tesseract)"""
        try:
            import pytesseract
            from PIL import Image
            img = Image.open(file_path)
            return pytesseract.image_to_string(img)
        except:
            return ""
    
    def _extract_information(self, text):
        """Extract structured information from text"""
        data = {
            'raw_text': text,
            'name': self._extract_name(text),
            'email': self._extract_email(text),
            'phone': self._extract_phone(text),
            'skills': self._extract_skills(text),
            'education': self._extract_education(text),
            'experience': self._extract_experience(text),
            'certifications': self._extract_certifications(text),
        }
        return data
    
    def _extract_name(self, text):
        """Extract name from resume"""
        lines = text.split('\n')
        for line in lines[:5]:
            line = line.strip()
            if len(line) > 3 and len(line) < 50 and not '@' in line:
                return line
        return ""
    
    def _extract_email(self, text):
        """Extract email using regex"""
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(pattern, text)
        return match.group(0) if match else ""
    
    def _extract_phone(self, text):
        """Extract phone number"""
        pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        match = re.search(pattern, text)
        return match.group(0) if match else ""
    
    def _extract_skills(self, text):
        """Extract skills"""
        common_skills = [
            'python', 'java', 'javascript', 'react', 'django', 'flask', 'sql', 'mysql',
            'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'html', 'css',
            'node.js', 'express', 'angular', 'vue', 'typescript', 'c++', 'c#', 'ruby',
            'php', 'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab', 'tensorflow',
            'pytorch', 'scikit-learn', 'pandas', 'numpy', 'machine learning', 'deep learning',
            'nlp', 'computer vision', 'data science', 'data analysis', 'agile', 'scrum'
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in common_skills:
            if skill in text_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def _extract_education(self, text):
        """Extract education information"""
        education = []
        degrees = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'mba', 'b.sc', 'm.sc']
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line_lower = line.lower()
            for degree in degrees:
                if degree in line_lower:
                    education.append({
                        'degree': line.strip(),
                        'context': ' '.join(lines[max(0, i-1):min(len(lines), i+2)])
                    })
                    break
        
        return education
    
    def _extract_experience(self, text):
        """Extract work experience"""
        experience = []
        
        # Look for year patterns (2019-2021, 2019 - Present, etc.)
        pattern = r'(\d{4})\s*[-–]\s*(\d{4}|Present|Current)'
        matches = re.finditer(pattern, text, re.IGNORECASE)
        
        for match in matches:
            start_pos = max(0, match.start() - 200)
            end_pos = min(len(text), match.end() + 200)
            context = text[start_pos:end_pos]
            
            experience.append({
                'period': match.group(0),
                'context': context.strip()
            })
        
        return experience
    
    def _extract_certifications(self, text):
        """Extract certifications"""
        certifications = []
        cert_keywords = ['certified', 'certification', 'certificate']
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in cert_keywords):
                certifications.append(line.strip())
        
        return certifications

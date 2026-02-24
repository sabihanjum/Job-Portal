class SemanticMatcher:
    def __init__(self):
        self._model = None
        self._util = None

    def _ensure_model(self):
        if self._model is None or self._util is None:
            from sentence_transformers import SentenceTransformer, util
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
            self._util = util
    
    def match_resume_to_job(self, resume_data, job_data):
        """
        Match resume to job using semantic similarity
        Returns match score, matched keywords, missing skills, and explainability data
        """
        # Prepare texts
        resume_text = self._prepare_resume_text(resume_data)
        job_text = self._prepare_job_text(job_data)
        
        self._ensure_model()

        # Compute embeddings
        resume_embedding = self._model.encode(resume_text, convert_to_tensor=True)
        job_embedding = self._model.encode(job_text, convert_to_tensor=True)
        
        # Compute similarity
        similarity = self._util.cos_sim(resume_embedding, job_embedding).item()
        match_percentage = round(similarity * 100, 2)
        
        # Extract matched and missing skills
        resume_skills = set(skill.lower() for skill in resume_data.get('skills', []))
        job_skills = set(skill.lower() for skill in job_data.get('required_skills', []))
        
        matched_skills = list(resume_skills & job_skills)
        missing_skills = list(job_skills - resume_skills)
        
        # Generate explainability heatmap
        heatmap = self._generate_heatmap(resume_data, job_data)
        
        return {
            'match_percentage': match_percentage,
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'heatmap': heatmap,
            'recommendation': self._generate_recommendation(match_percentage, missing_skills)
        }
    
    def _prepare_resume_text(self, resume_data):
        """Prepare resume text for embedding"""
        parts = []
        
        if resume_data.get('skills'):
            parts.append("Skills: " + ", ".join(resume_data['skills']))
        
        if resume_data.get('experience'):
            exp_texts = [exp.get('context', '') for exp in resume_data['experience']]
            parts.append("Experience: " + " ".join(exp_texts))
        
        if resume_data.get('education'):
            edu_texts = [edu.get('degree', '') for edu in resume_data['education']]
            parts.append("Education: " + " ".join(edu_texts))
        
        return " ".join(parts)
    
    def _prepare_job_text(self, job_data):
        """Prepare job text for embedding"""
        parts = [
            job_data.get('title', ''),
            job_data.get('description', ''),
            job_data.get('requirements', ''),
        ]
        
        if job_data.get('required_skills'):
            parts.append("Required skills: " + ", ".join(job_data['required_skills']))
        
        return " ".join(parts)
    
    def _generate_heatmap(self, resume_data, job_data):
        """Generate explainability heatmap"""
        heatmap = []
        
        # Split job requirements into sentences
        job_requirements = job_data.get('requirements', '').split('.')
        job_requirements = [req.strip() for req in job_requirements if req.strip()]
        
        # Get resume sections
        resume_sections = []
        
        if resume_data.get('skills'):
            resume_sections.append({
                'text': "Skills: " + ", ".join(resume_data['skills']),
                'type': 'skills'
            })
        
        if resume_data.get('experience'):
            for exp in resume_data['experience']:
                resume_sections.append({
                    'text': exp.get('context', '')[:200],
                    'type': 'experience'
                })
        
        # Compute similarity between each resume section and job requirement
        for req in job_requirements[:5]:  # Limit to top 5 requirements
            req_embedding = self._model.encode(req, convert_to_tensor=True)
            
            best_match = None
            best_score = 0
            
            for section in resume_sections:
                section_embedding = self._model.encode(section['text'], convert_to_tensor=True)
                score = self._util.cos_sim(req_embedding, section_embedding).item()
                
                if score > best_score:
                    best_score = score
                    best_match = section
            
            if best_match and best_score > 0.3:
                heatmap.append({
                    'job_requirement': req,
                    'resume_fragment': best_match['text'][:150],
                    'match_score': round(best_score, 2),
                    'section_type': best_match['type']
                })
        
        return heatmap
    
    def _generate_recommendation(self, match_percentage, missing_skills):
        """Generate recommendation based on match"""
        if match_percentage >= 80:
            return "Excellent match! Highly recommended for interview."
        elif match_percentage >= 60:
            return f"Good match. Consider upskilling in: {', '.join(missing_skills[:3])}"
        elif match_percentage >= 40:
            return f"Moderate match. Significant skill gaps: {', '.join(missing_skills[:5])}"
        else:
            return "Low match. Consider other opportunities or extensive upskilling."
    
    def rank_candidates(self, candidates_data, job_data):
        """Rank multiple candidates for a job"""
        rankings = []
        
        for candidate in candidates_data:
            match_result = self.match_resume_to_job(candidate['resume_data'], job_data)
            rankings.append({
                'candidate_id': candidate['id'],
                'match_percentage': match_result['match_percentage'],
                'matched_skills': match_result['matched_skills'],
                'missing_skills': match_result['missing_skills']
            })
        
        # Sort by match percentage
        rankings.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        return rankings

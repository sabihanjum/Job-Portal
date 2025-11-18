import hashlib
import re
from datetime import datetime

class FraudDetector:
    def detect_fraud(self, resume_data):
        """Detect potential fraud in resume"""
        flags = []
        
        # Check for suspicious email patterns
        email = resume_data.get('email', '')
        if self._is_suspicious_email(email):
            flags.append({
                'type': 'suspicious_email',
                'severity': 'medium',
                'message': 'Email domain appears suspicious'
            })
        
        # Check timeline consistency
        experience = resume_data.get('experience', [])
        if not self._check_timeline_consistency(experience):
            flags.append({
                'type': 'timeline_inconsistency',
                'severity': 'high',
                'message': 'Work experience timeline has overlaps or gaps'
            })
        
        # Check for duplicate content
        if self._has_duplicate_content(resume_data):
            flags.append({
                'type': 'duplicate_content',
                'severity': 'low',
                'message': 'Resume contains repetitive content'
            })
        
        return {
            'is_suspicious': len(flags) > 0,
            'risk_level': self._calculate_risk_level(flags),
            'flags': flags
        }
    
    def _is_suspicious_email(self, email):
        """Check if email domain is suspicious"""
        suspicious_domains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail']
        return any(domain in email.lower() for domain in suspicious_domains)
    
    def _check_timeline_consistency(self, experience):
        """Check if work experience timeline is consistent"""
        if not experience:
            return True
        
        # Extract years from experience
        years = []
        for exp in experience:
            period = exp.get('period', '')
            matches = re.findall(r'\d{4}', period)
            if len(matches) >= 2:
                years.append((int(matches[0]), int(matches[1])))
        
        # Check for overlaps
        for i in range(len(years)):
            for j in range(i + 1, len(years)):
                start1, end1 = years[i]
                start2, end2 = years[j]
                
                # Check if periods overlap
                if not (end1 < start2 or end2 < start1):
                    return False
        
        return True
    
    def _has_duplicate_content(self, resume_data):
        """Check for duplicate or repetitive content"""
        raw_text = resume_data.get('raw_text', '')
        
        # Split into sentences
        sentences = re.split(r'[.!?]', raw_text)
        sentences = [s.strip().lower() for s in sentences if len(s.strip()) > 20]
        
        # Check for duplicates
        unique_sentences = set(sentences)
        
        return len(sentences) > 10 and len(unique_sentences) / len(sentences) < 0.7
    
    def _calculate_risk_level(self, flags):
        """Calculate overall risk level"""
        if not flags:
            return 'none'
        
        severity_scores = {'low': 1, 'medium': 2, 'high': 3}
        total_score = sum(severity_scores.get(flag['severity'], 0) for flag in flags)
        
        if total_score >= 5:
            return 'high'
        elif total_score >= 3:
            return 'medium'
        else:
            return 'low'
    
    def compute_resume_hash(self, resume_text):
        """Compute hash for duplicate detection"""
        return hashlib.md5(resume_text.encode()).hexdigest()

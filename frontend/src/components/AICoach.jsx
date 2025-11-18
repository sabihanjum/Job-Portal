import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AICoach() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Role-specific initial messages
  const getInitialMessage = () => {
    if (user?.role === 'candidate') {
      return {
        role: 'assistant',
        content: 'Hi! I\'m your AI Career Coach. I can help you with:\n• Interview preparation tips\n• Resume review and suggestions\n• Career advice and guidance\n• Job search strategies\n\nWhat would you like help with today?'
      }
    } else if (user?.role === 'recruiter') {
      return {
        role: 'assistant',
        content: 'Hi! I\'m your AI Recruitment Assistant. I can help you with:\n• Writing effective job descriptions\n• Candidate screening strategies\n• Interview question suggestions\n• Hiring best practices\n• Diversity and inclusion tips\n\nHow can I assist you today?'
      }
    } else if (user?.role === 'admin') {
      return {
        role: 'assistant',
        content: 'Hi! I\'m your AI Admin Assistant. I can help you with:\n• System management tips\n• User management strategies\n• Analytics interpretation\n• Platform optimization\n• Security best practices\n\nWhat would you like to know?'
      }
    }
    return {
      role: 'assistant',
      content: 'Hi! How can I help you today?'
    }
  }

  const [messages, setMessages] = useState([getInitialMessage()])

  // Reset messages when user role changes
  useEffect(() => {
    setMessages([getInitialMessage()])
    setIsOpen(false) // Close chat when switching roles
  }, [user?.role])

  // Role-specific quick actions
  const getQuickActions = () => {
    if (user?.role === 'candidate') {
      return [
        { label: 'Interview Tips', prompt: 'Give me tips for preparing for a technical interview' },
        { label: 'Resume Review', prompt: 'How can I improve my resume?' },
        { label: 'Career Advice', prompt: 'What skills should I learn for career growth?' },
        { label: 'Job Search', prompt: 'How do I find the right job opportunities?' }
      ]
    } else if (user?.role === 'recruiter') {
      return [
        { label: 'Job Description', prompt: 'How to write an effective job description?' },
        { label: 'Screen Candidates', prompt: 'Best practices for screening candidates' },
        { label: 'Interview Questions', prompt: 'Suggest interview questions for a developer role' },
        { label: 'Diversity Hiring', prompt: 'Tips for inclusive hiring practices' }
      ]
    } else if (user?.role === 'admin') {
      return [
        { label: 'User Management', prompt: 'Best practices for managing users' },
        { label: 'Analytics', prompt: 'How to interpret platform analytics?' },
        { label: 'Security', prompt: 'Security best practices for the platform' },
        { label: 'Optimization', prompt: 'How to optimize platform performance?' }
      ]
    }
    return []
  }

  const quickActions = getQuickActions()

  const handleSend = async (message = input) => {
    if (!message.trim()) return

    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Simulate AI response (in production, call actual AI API)
      const response = await simulateAIResponse(message)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      toast.error('Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const simulateAIResponse = async (message) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const lowerMessage = message.toLowerCase()

    // Candidate-specific responses
    if (user?.role === 'candidate') {
      if (lowerMessage.includes('interview')) {
        return `Great question about interviews! Here are some key tips:

1. **Research the Company**: Understand their products, culture, and recent news
2. **Practice Common Questions**: Prepare for behavioral and technical questions
3. **STAR Method**: Use Situation, Task, Action, Result for behavioral questions
4. **Ask Questions**: Prepare thoughtful questions about the role and team
5. **Follow Up**: Send a thank-you email within 24 hours

Would you like specific tips for technical or behavioral interviews?`
      }

      if (lowerMessage.includes('resume')) {
        return `Here are key tips for an effective resume:

1. **Keep it Concise**: 1-2 pages maximum
2. **Quantify Achievements**: Use numbers and metrics
3. **Tailor to Job**: Customize for each application
4. **Use Action Verbs**: Start with strong verbs (Led, Developed, Achieved)
5. **Highlight Skills**: Match keywords from job description
6. **Proofread**: Zero typos or grammatical errors

Would you like me to review specific sections of your resume?`
      }

      if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
        return `Here are in-demand skills for 2025:

**Technical Skills:**
• Cloud Computing (AWS, Azure, GCP)
• AI/Machine Learning
• Data Analysis & Visualization
• Cybersecurity
• Full-Stack Development

**Soft Skills:**
• Communication & Collaboration
• Problem-solving
• Adaptability
• Leadership
• Critical Thinking

Focus on skills that align with your career goals. What field are you interested in?`
      }

      if (lowerMessage.includes('job') || lowerMessage.includes('search')) {
        return `Effective job search strategies:

1. **Optimize Your Profile**: Update LinkedIn and professional profiles
2. **Network Actively**: Attend events, connect with professionals
3. **Use Multiple Platforms**: Job boards, company sites, LinkedIn
4. **Set Up Alerts**: Get notified of new opportunities
5. **Customize Applications**: Tailor each resume and cover letter
6. **Follow Up**: Check application status after 1-2 weeks

Our platform's AI matching can help you find the best-fit opportunities!`
      }
    }

    // Recruiter-specific responses
    if (user?.role === 'recruiter') {
      if (lowerMessage.includes('job description') || lowerMessage.includes('jd')) {
        return `Writing an effective job description:

1. **Clear Job Title**: Use standard, searchable titles
2. **Compelling Summary**: Hook candidates in the first paragraph
3. **Specific Requirements**: List must-have vs nice-to-have skills
4. **Responsibilities**: Be clear about day-to-day tasks
5. **Company Culture**: Highlight what makes your company unique
6. **Avoid Bias**: Use inclusive language, avoid age/gender indicators
7. **Salary Range**: Transparency attracts better candidates

Use our AI bias detector to ensure inclusive language!`
      }

      if (lowerMessage.includes('screen') || lowerMessage.includes('candidate')) {
        return `Best practices for candidate screening:

1. **Use AI Matching**: Leverage our semantic matching for initial screening
2. **Review Match Scores**: Focus on candidates with 60%+ match
3. **Check Skills Gap**: Evaluate missing skills - are they trainable?
4. **Phone Screen First**: 15-20 min call before full interview
5. **Structured Process**: Use same criteria for all candidates
6. **Check References**: Verify key claims
7. **Cultural Fit**: Assess alignment with company values

Our platform's match explainability shows why candidates match!`
      }

      if (lowerMessage.includes('interview question')) {
        return `Effective interview questions:

**Technical Questions:**
• "Walk me through your approach to [specific problem]"
• "Explain a complex technical concept to a non-technical person"
• "Describe your most challenging project and how you solved it"

**Behavioral Questions:**
• "Tell me about a time you disagreed with a team member"
• "How do you prioritize when everything is urgent?"
• "Describe a failure and what you learned"

**Culture Fit:**
• "What type of work environment helps you thrive?"
• "How do you handle feedback?"

Use our AI interview question generator for role-specific questions!`
      }

      if (lowerMessage.includes('diversity') || lowerMessage.includes('inclusive')) {
        return `Tips for inclusive hiring:

1. **Blind Resume Review**: Remove names/photos initially
2. **Diverse Interview Panels**: Multiple perspectives reduce bias
3. **Structured Interviews**: Same questions for all candidates
4. **Skills-Based Assessment**: Focus on abilities, not background
5. **Inclusive Job Descriptions**: Use our bias detector
6. **Diverse Sourcing**: Post on multiple platforms
7. **Unconscious Bias Training**: Educate your team

Our platform's bias detection helps ensure fair hiring practices!`
      }
    }

    // Admin-specific responses
    if (user?.role === 'admin') {
      if (lowerMessage.includes('user') || lowerMessage.includes('manage')) {
        return `User management best practices:

1. **Role-Based Access**: Ensure proper permissions for each role
2. **Regular Audits**: Review user activity logs monthly
3. **Inactive Users**: Deactivate accounts after 90 days of inactivity
4. **Security**: Enforce strong password policies
5. **Support**: Respond to user issues within 24 hours
6. **Training**: Provide onboarding materials for new users

Check the Audit Logs section for detailed user activity!`
      }

      if (lowerMessage.includes('analytics') || lowerMessage.includes('metric')) {
        return `Interpreting platform analytics:

**Key Metrics to Track:**
• User Growth Rate: New registrations per week
• Application Conversion: Applications per job posting
• Match Quality: Average match scores
• Time to Hire: Days from posting to acceptance
• User Engagement: Active users per day

**Red Flags:**
• Declining match scores: Review job descriptions
• Low application rates: Improve job visibility
• High rejection rates: Assess screening criteria

Use the Analytics Dashboard for detailed insights!`
      }

      if (lowerMessage.includes('security')) {
        return `Security best practices:

1. **Regular Updates**: Keep all dependencies up to date
2. **Access Control**: Review admin permissions quarterly
3. **Data Backup**: Daily automated backups
4. **Audit Logs**: Monitor for suspicious activity
5. **SSL/HTTPS**: Ensure all connections are encrypted
6. **Password Policy**: Enforce strong passwords
7. **2FA**: Consider implementing two-factor authentication

Review Audit Logs regularly for security monitoring!`
      }

      if (lowerMessage.includes('optimize') || lowerMessage.includes('performance')) {
        return `Platform optimization tips:

1. **Database**: Add indexes to frequently queried fields
2. **Caching**: Implement Redis for frequently accessed data
3. **CDN**: Use CDN for static assets
4. **Monitoring**: Set up performance monitoring tools
5. **Load Testing**: Test under high traffic scenarios
6. **Code Review**: Regular code quality audits
7. **User Feedback**: Act on user-reported issues

Monitor Analytics Dashboard for performance metrics!`
      }
    }

    // Generic response
    const roleContext = user?.role === 'candidate' ? 'career development' :
                       user?.role === 'recruiter' ? 'recruitment' :
                       user?.role === 'admin' ? 'platform management' : 'general'

    return `I understand you're asking about "${message}". 

As your AI assistant for ${roleContext}, I can help with various topics. Could you be more specific about what you'd like help with? Try using the quick action buttons below for common questions!`
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold text-lg">
              {user?.role === 'candidate' ? 'AI Career Coach' :
               user?.role === 'recruiter' ? 'AI Recruitment Assistant' :
               user?.role === 'admin' ? 'AI Admin Assistant' : 'AI Assistant'}
            </h3>
            <p className="text-sm text-blue-100">
              {user?.role === 'candidate' ? 'Your personal career assistant' :
               user?.role === 'recruiter' ? 'Your hiring companion' :
               user?.role === 'admin' ? 'Your platform management helper' : 'Here to help'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  disabled={loading}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

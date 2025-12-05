import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/openai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { title, content, level } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // 난이도별 지시사항
    let levelInstructions = ''
    if (level === 'beginner') {
      levelInstructions = `BEGINNER LEVEL (A1-A2):
- Use simple, everyday vocabulary (e.g., "think", "like", "important", "good", "bad")
- Keep the question short and easy to understand (10-15 words)
- Use simple sentence structures (present tense, basic questions)
- Ask about personal opinions or simple facts
- Encourage responses of 50-100 words using simple English
- Example style: "What do you think about this news? Do you like it? Why?"`
    } else if (level === 'intermediate') {
      levelInstructions = `INTERMEDIATE LEVEL (B1-B2):
- Use clear language with some academic vocabulary (e.g., "opinion", "analysis", "impact", "perspective")
- Create a question with medium complexity (15-25 words)
- Use varied sentence structures (present perfect, conditionals, relative clauses)
- Ask for opinions with reasons and examples
- Encourage responses of 100-150 words with detailed explanations
- Example style: "What is your opinion on this article? Please provide your analysis and explain your reasoning."`
    } else {
      levelInstructions = `ADVANCED LEVEL (C1-C2):
- Use sophisticated, academic vocabulary (e.g., "analyze", "critically evaluate", "implications", "nuanced perspective")
- Create a complex, thought-provoking question (20-30 words)
- Use advanced sentence structures (subjunctive, complex conditionals, nominalizations)
- Ask for critical analysis, implications, and sophisticated viewpoints
- Encourage responses of 150-200 words with comprehensive analysis
- Example style: "Critically analyze this article and discuss the broader implications. Provide a nuanced perspective on the topic."`
    }
    
    // 기사 내용을 더 많이 사용 (8000자로 증가)
    const articleContent = content.substring(0, 8000)
    
    // 기사에서 핵심 키워드와 주제 추출
    const extractKeyTopics = (text: string): string[] => {
      // 고유명사, 숫자, 중요한 단어 추출
      const properNouns = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
      const numbers = text.match(/\d+%|\$\d+|\d+\s+(?:million|billion|thousand|percent|people|countries|jobs|dollars)/gi) || []
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 4 && !['this', 'that', 'these', 'those', 'their', 'there', 'would', 'could', 'should'].includes(word))
      
      const wordCount: Record<string, number> = {}
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1
      })
      
      const topWords = Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word)
      
      // 고유명사와 숫자도 포함 (중복 제거)
      const combined = [...properNouns.slice(0, 5), ...numbers.slice(0, 3), ...topWords]
      const seen: Record<string, boolean> = {}
      const uniqueTopics: string[] = []
      for (const item of combined) {
        if (!seen[item.toLowerCase()]) {
          seen[item.toLowerCase()] = true
          uniqueTopics.push(item)
        }
      }
      return uniqueTopics.slice(0, 15)
    }
    
    const keyTopics = extractKeyTopics(title + ' ' + articleContent)
    
    // 기사 내용의 핵심 문장 추출
    const extractKeySentences = (text: string): string => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
      // 첫 3문장 + 중간 2문장 + 마지막 2문장
      const firstSentences = sentences.slice(0, 3)
      const middleSentences = sentences.slice(Math.floor(sentences.length / 2), Math.floor(sentences.length / 2) + 2)
      const lastSentences = sentences.slice(-2)
      // 중복 제거
      const combined = [...firstSentences, ...middleSentences, ...lastSentences]
      const seen: Record<string, boolean> = {}
      const selected: string[] = []
      for (const sentence of combined) {
        const trimmed = sentence.trim()
        if (!seen[trimmed]) {
          seen[trimmed] = true
          selected.push(trimmed)
        }
      }
      return selected.join('. ').trim()
    }
    
    const keySentences = extractKeySentences(articleContent)
    
    // 기사에 대한 의견을 묻는 질문 생성 (쟁점 추출 없이)
    const prompt = `You are an English language teacher. Your task is to create a thoughtful writing question about this news article.

${levelInstructions}

Article Title: ${title}

Key Topics/Keywords/Entities: ${keyTopics.join(', ')}

Key Content Excerpt (representative sentences from beginning, middle, and end):
${keySentences}

Full Article Content (${articleContent.length} characters):
${articleContent}

=== YOUR TASK ===
Create a question that asks students to write their opinion about this article. The question should:

1. **Reference the article's main topic or key points** - mention what the article is about
2. **Be specific to this article** - reference specific details, events, or topics mentioned in the article
3. **Encourage thoughtful response** - ask for opinions, thoughts, analysis, or reflections
4. **Match the difficulty level** - use appropriate vocabulary and sentence complexity for ${level} level
5. **Be open-ended** - allow students to express their own views and reasoning

=== GOOD QUESTION FORMATS ===
✅ "What is your opinion on [specific topic/event from the article]? Please explain your thoughts."
✅ "After reading about [specific detail from article], what are your thoughts on this issue?"
✅ "The article discusses [specific topic]. What is your perspective on this matter?"
✅ "What do you think about [specific event/policy/topic mentioned in the article]? Please share your views."
✅ "How do you feel about [specific aspect from the article]? Explain your reasoning."

=== FORBIDDEN QUESTION FORMATS ===
❌ "What is your position on this debate?" (too debate-focused)
❌ "Which side do you support?" (too debate-focused)
❌ "Do you agree or disagree?" (too debate-focused)
❌ "What are the two sides of this issue?" (too debate-focused)
❌ Generic questions without referencing the article

=== EXAMPLES ===

Example 1 - Climate Article:
"What is your opinion on the climate summit's goal to reduce emissions by 50% by 2030? Please explain your thoughts on this target."

Example 2 - Technology Article:
"The article discusses how AI is being used in healthcare. What are your thoughts on using artificial intelligence in medical settings?"

Example 3 - Political Article:
"After reading about the new immigration policy mentioned in the article, what is your perspective on this issue?"

Example 4 - Education Article:
"The article reports that some schools are banning smartphones. What do you think about this policy? Please share your views."

=== CRITICAL INSTRUCTIONS ===
1. **Ask for opinion about the article's content** - not about a debate or controversy
2. **Reference specific details from the article** - make it clear this question is about THIS article
3. **Encourage thoughtful writing** - ask for explanations, reasoning, or analysis
4. **Be appropriate for ${level} level** - use vocabulary and sentence complexity that matches the level
5. Return ONLY the question text, no explanation

=== YOUR OUTPUT ===
Create ONE question that asks students to write their opinion about this article.`

    const systemInstruction = `You are an English language teacher creating writing prompts for students to express their opinions about news articles.

ABSOLUTE REQUIREMENTS:
1. You MUST create a question that asks for the student's opinion about the article's content
2. You MUST reference specific details, topics, or events from the article
3. You MUST encourage thoughtful writing with explanations and reasoning
4. You MUST match the ${level} difficulty level
5. You MUST NOT create debate-style questions asking students to choose sides

FORBIDDEN QUESTION FORMATS (NEVER USE):
- "What is your position on this debate?"
- "Which side do you support?"
- "Do you agree or disagree?"
- "What are the two sides of this issue?"
- "Some argue X, while others claim Y. What is your position?"
- Questions that force students to choose between opposing sides

REQUIRED QUESTION STRUCTURE:
Ask for opinion about the article:
- "What is your opinion on [specific topic from article]? Please explain your thoughts."
- "After reading about [specific detail], what are your thoughts on this issue?"
- "The article discusses [topic]. What is your perspective on this matter?"
- "What do you think about [specific event/policy from article]? Please share your views."

Your question MUST:
1. Ask for the student's opinion about the article's content
2. Reference specific details from the article
3. Encourage thoughtful writing with explanations
4. Be appropriate for ${level} level
5. Be open-ended to allow students to express their own views

Always respond with ONLY the question text.`

    try {
      const question = await generateText(prompt, systemInstruction)
      
      // 질문 정리 (불필요한 텍스트 제거)
      let cleanQuestion = question.trim()
        .replace(/^Question:\s*/i, '')
        .replace(/^Q:\s*/i, '')
        .replace(/^Here's\s+(the\s+)?question:\s*/i, '')
        .replace(/^The\s+question\s+is:\s*/i, '')
        .trim()
      
      // 금지된 패턴 확인 (논쟁형 질문 거부)
      const forbiddenPatterns = [
        /what\s+is\s+your\s+position\s+on\s+this\s+debate/i,
        /which\s+side\s+do\s+you\s+support/i,
        /do\s+you\s+agree\s+or\s+disagree/i,
        /what\s+are\s+the\s+two\s+sides/i,
        /some\s+argue.*while\s+others.*what\s+is\s+your\s+position/i,
        /which\s+perspective\s+do\s+you\s+support/i,
        /which\s+side\s+of\s+this\s+debate/i,
      ]
      
      const hasForbiddenPattern = forbiddenPatterns.some(pattern => pattern.test(cleanQuestion))
      
      // 기사 내용을 참조하는지 확인
      const referencesArticle = 
        /(?:article|news|report|story|discusses?|mentions?|describes?|reports?|according\s+to)/i.test(cleanQuestion) ||
        keyTopics.some(topic => cleanQuestion.toLowerCase().includes(topic.toLowerCase()))
      
      // 질문이 충분히 구체적인지 확인
      const isQuestionSpecific = cleanQuestion.length > 40 && referencesArticle
      
      if (hasForbiddenPattern) {
        console.warn('Generated question contains debate/position format:', cleanQuestion.substring(0, 100))
        throw new Error('Question format not acceptable - contains debate/position format')
      }
      
      if (!isQuestionSpecific) {
        console.warn('Generated question is too generic:', cleanQuestion.substring(0, 100))
        throw new Error('Question format not acceptable - too generic or does not reference article')
      }
      
      return NextResponse.json({ question: cleanQuestion })
    } catch (error: any) {
      console.error('Error generating question:', error)
      
      // Fallback: 기사 내용 기반으로 의견 질문 생성
      const mainTopic = title.split(/\s+/).slice(0, 5).join(' ')
      const fallbackQuestions: Record<string, string> = {
        beginner: `What do you think about this article? Write your opinion in simple English.`,
        intermediate: `What is your opinion on the topic discussed in this article? Please explain your thoughts and reasoning.`,
        advanced: `After reading this article, what is your perspective on the issues it discusses? Please provide a thoughtful analysis.`,
      }
      
      return NextResponse.json({ 
        question: fallbackQuestions[level] || fallbackQuestions['intermediate']
      })
    }
  } catch (error) {
    console.error('Error in generate-question API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


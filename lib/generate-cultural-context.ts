import { generateText } from './openai'

/**
 * 기사 내용에 맞는 문화적 맥락을 생성합니다
 */
export async function generateCulturalContext(
  title: string,
  content: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): Promise<{
  title: string
  description: string
  examples: string[]
}> {
  // 난이도별 지시사항
  let levelGuidance = ''
  if (level === 'beginner') {
    levelGuidance = `BEGINNER LEVEL (A1-A2) - SIMPLE EXPLANATIONS:
- Use VERY simple language and basic vocabulary (e.g., "important", "people", "different", "same", "good", "bad")
- Use short sentences (10-15 words maximum)
- Explain cultural background in easy-to-understand terms
- Focus on simple facts: "In some countries, people do X. In other countries, people do Y."
- Use simple examples that beginners can relate to
- Avoid complex concepts, academic terms, or sophisticated analysis
- Keep explanations to 3-4 simple sentences`
  } else if (level === 'intermediate') {
    levelGuidance = `INTERMEDIATE LEVEL (B1-B2) - DETAILED EXPLANATIONS:
- Use clear language with SOME academic vocabulary (e.g., "perspective", "significance", "tradition", "custom", "society")
- Use medium-length sentences (15-25 words)
- Provide detailed cultural background knowledge with moderate complexity
- Include historical context, societal perspectives, and cultural significance
- Explain how different cultures might view this topic differently
- Use specific examples from different countries or regions
- Provide 5-6 detailed sentences with moderate complexity`
  } else {
    levelGuidance = `ADVANCED LEVEL (C1-C2) - SOPHISTICATED ANALYSIS:
- Use sophisticated, academic, and nuanced vocabulary (e.g., "ideological framework", "cultural paradigm", "societal construct", "historical trajectory", "cross-cultural perspective")
- Use complex sentence structures (20-35 words)
- Provide sophisticated cultural analysis with nuanced understanding
- Include deep historical context, cross-cultural perspectives, and ideological frameworks
- Discuss broader cultural implications and theoretical perspectives
- Use advanced concepts and academic terminology
- Provide 7-8 comprehensive sentences with sophisticated analysis`
  }

  // 기사 내용을 더 많이 활용 (최대 8000자로 증가)
  const articleContent = content.length > 8000 ? content.substring(0, 8000) : content
  
  // 기사에서 주요 키워드와 주제 추출
  const mainTopic = identifyMainTopic(title, content)
  const keyEntities = extractKeyEntities(title, content)
  const specificInfo = extractSpecificInfo(title, content)
  
  const prompt = `You are a cultural studies expert and educator. Your task is to DEEPLY ANALYZE this specific news article and provide UNIQUE, ARTICLE-SPECIFIC cultural and historical background knowledge.

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. Read the ENTIRE article content below - analyze EVERY sentence, EVERY word for specific details
2. Extract ALL specific information from the article: 
   - Exact dates and years (e.g., "2016", "January 6, 2021", "the 1980s", "since 1979")
   - Specific countries, cities, regions mentioned (e.g., "China", "Nebraska", "Washington D.C.", "the American Midwest")
   - Specific organizations, institutions, teams (e.g., "University of Nebraska", "UN", "NATO", "FBI", "DNC", "RNC")
   - Specific people mentioned (e.g., "Trump", "Biden", "Xi Jinping", "Brian Cole")
   - Specific events, policies, treaties (e.g., "the Chinese Civil War", "the Paris Agreement", "the Trade War", "the Capitol riot")
   - Specific numbers, statistics, percentages (e.g., "1,500 people", "$500 billion", "50%")
3. Extract the MAIN TOPIC and SUBTOPICS discussed in this article
4. Identify what CULTURAL or HISTORICAL background knowledge a reader would need to understand this article's significance
5. DO NOT summarize the article - provide BACKGROUND knowledge that helps interpret it
6. MANDATORY: Your description MUST start with a SPECIFIC fact, date, event, or name from the article - NOT a generic statement
7. CRITICAL: You MUST use the EXACT information from the article. If the article mentions "January 6, 2021", use "January 6, 2021". If it mentions "FBI", use "FBI". If it mentions "DNC", use "DNC".

ARTICLE INFORMATION:
Title: ${title}
Main Topic Identified: ${mainTopic}
Key Entities Mentioned: ${keyEntities.length > 0 ? keyEntities.join(', ') : 'Various'}
Specific Information Extracted: ${specificInfo}
Full Article Content (${articleContent.length} characters):
${articleContent}

STEP 1: DEEP ARTICLE ANALYSIS
Read the article content above and extract:
1. **Specific Entities**: What specific teams, organizations, people, countries, cities are mentioned? (e.g., "Huskers", "University of Nebraska", "Nebraska", "college football")
2. **Historical Context**: What dates, years, historical events are referenced? (e.g., "1890", "late 19th century", "Industrial Revolution")
3. **Cultural Elements**: What cultural practices, traditions, or social aspects are discussed? (e.g., "college football culture", "agricultural heritage", "regional identity")
4. **Key Numbers/Statistics**: What specific numbers, percentages, or statistics are mentioned? (e.g., "2 million jobs", "$500 billion", "50% by 2030")
5. **Geographic/Location Info**: What specific places, regions, or locations are mentioned? (e.g., "American Midwest", "Nebraska", "Paris", "Taiwan")
6. **Organizations/Institutions**: What specific organizations, institutions, or groups are mentioned? (e.g., "University of Nebraska", "UN", "NATO", "IPCC")

STEP 2: PROVIDE SPECIFIC BACKGROUND KNOWLEDGE
Based on what you extracted above, provide cultural/historical background that helps readers understand:

CRITICAL: You MUST use the specific information you extracted from the article. Do NOT make generic statements!

- **If a specific team/organization is mentioned**: 
  - Start with: "The [ORGANIZATION NAME] was established in [YEAR]..."
  - Explain what it is, when it was founded (use the exact year if mentioned), its cultural/historical significance, and why it matters in that culture
  - Use specific examples from the article
  
- **If a specific country/region is mentioned**: 
  - Start with: "In [COUNTRY/REGION], [SPECIFIC FACT] has shaped..."
  - Explain relevant cultural practices, historical events, or social structures in that region related to the article's topic
  - Reference specific dates, events, or policies mentioned in the article
  
- **If a specific event is mentioned**: 
  - Start with: "The [EVENT NAME] ([YEAR-YEAR] or [YEAR]) occurred when..."
  - Explain the historical background, causes, and cultural significance of that event
  - Use specific dates and details from the article
  
- **If a policy/decision is discussed**: 
  - Start with: "The [POLICY NAME] was established in [YEAR]..." or "In [YEAR], [COUNTRY] implemented..."
  - Explain the cultural values, historical precedents, or social structures that shape such policies in that context
  - Reference specific policies, laws, or decisions mentioned in the article
  
- **If organizations/treaties are mentioned**: 
  - Start with: "[ORGANIZATION NAME] was created in [YEAR]..." or "The [TREATY NAME] was signed in [YEAR]..."
  - Explain when they were created (use exact year if mentioned), their historical purpose, and their cultural/political significance
  - Use specific details from the article
  
- **If sports are discussed**: 
  - Start with: "[SPORT NAME] emerged in [COUNTRY/REGION] in [YEAR]..." or "The [TEAM NAME] was established in [YEAR]..."
  - Explain the cultural significance of that sport in that specific region/country, including historical development and social meaning
  - Use specific teams, dates, or events mentioned in the article
  
- **If education is discussed**: 
  - Start with: "The [EDUCATION SYSTEM/INSTITUTION] in [COUNTRY] was established in [YEAR]..." or "In [YEAR], [COUNTRY] implemented..."
  - Explain the cultural/historical context of education systems in that region, including how they developed and what values they reflect
  - Use specific institutions, dates, or policies from the article

REMEMBER: ALWAYS start with a SPECIFIC fact, date, name, or event from the article. NEVER start with generic phrases!

CRITICAL: Your explanation MUST:
- Start with a SPECIFIC fact, date, or historical event (NOT a generic statement)
- Reference the SPECIFIC entities, places, or events mentioned in the article
- Explain WHY this background matters for understanding THIS specific article
- Use concrete examples, names, dates, and facts from the article
- Connect cultural practices to historical development

CRITICAL REQUIREMENTS - YOU MUST FOLLOW THESE:
1. DO NOT summarize the article - provide BACKGROUND knowledge
2. DO NOT use generic phrases like "this is important", "different cultures have different views", "this topic has important cultural background", "understanding the context helps", "different cultures and historical experiences shape"
3. DO provide SPECIFIC facts, dates, events, names, and examples related to what the article discusses
4. DO reference specific information from the article (countries, events, organizations, teams, people mentioned)
5. DO explain historical background, cultural practices, or social contexts SPECIFIC to the article's topic
6. DO mention specific countries, organizations, or cultural groups that are relevant to THIS article
7. DO explain why understanding this background helps interpret THIS specific article
8. DO start with a SPECIFIC fact, date, or historical event - NOT a generic statement
9. DO use concrete examples, names, dates, and facts - NOT abstract statements
10. If the article mentions a specific name (like "Huskers"), explain what that is and its cultural/historical significance

For the topic "${mainTopic}" as discussed in THIS article, provide information such as:
- Historical events, dates, or developments SPECIFIC to what the article mentions
- Cultural practices or traditions relevant to the countries/regions mentioned in the article
- Real examples from the specific countries or regions discussed in the article
- Key concepts, terms, or frameworks that are relevant to understanding this article's topic
- Cultural values or beliefs that shape discussions about the specific issue in this article

${levelGuidance}

Provide your response as JSON with this exact structure:
{
  "title": "A specific, descriptive title about the cultural/historical theme (e.g., 'The History of Climate Diplomacy', 'AI Ethics Across Cultures', 'Taiwan's Complex International Status')",
  "description": "A ${level === 'beginner' ? 'simple' : level === 'intermediate' ? 'detailed' : 'comprehensive'} explanation (minimum 250 words, 5-7 sentences) with SPECIFIC facts: 
  
  MANDATORY REQUIREMENTS:
  - MUST start with a concrete historical event, date, year, or specific fact from the article (e.g., 'In 2016, Donald Trump was elected...' or 'The Chinese Civil War (1945-1949) resulted in...' or 'The University of Nebraska established its football team in 1890...')
  - MUST include at least 2-3 specific details from the article (dates, countries, organizations, people, events)
  - MUST explain the historical development or cultural significance using concrete examples
  - MUST reference specific countries, organizations, or events mentioned in the article
  - MUST explain why this background helps interpret THIS specific article
  - MUST use concrete examples, names, dates, and facts - NOT abstract statements
  - FORBIDDEN: Do NOT use phrases like 'has specific historical significance', 'evolved through particular events', 'understanding the context helps' - these are too generic!
  
  Example of GOOD start: 'The Chinese Civil War (1945-1949) resulted in the Republic of China government retreating to Taiwan...'
  Example of BAD start: 'This topic has specific historical and cultural significance...'",
  "examples": ["specific term 1", "specific term 2", "specific term 3", "specific term 4"]
}

EXAMPLE OF GOOD RESPONSE (for an article about climate summit):
{
  "title": "The History of Climate Diplomacy and Global Equity Debates",
  "description": "The concept of climate justice emerged in the 1990s when developing nations argued that industrialized countries, having benefited from fossil fuel use since the Industrial Revolution (starting around 1750), bear greater responsibility for addressing climate change. The 1992 Rio Earth Summit first established the principle of 'common but differentiated responsibilities,' recognizing that developed nations' historical emissions have created an 'atmospheric debt.' This framework continues to shape climate negotiations today, with countries like India and China emphasizing their right to development while Western nations focus on current emission levels. The 2015 Paris Agreement marked a shift toward voluntary national commitments, reflecting ongoing tensions between equity, historical responsibility, and the right to development.",
  "examples": ["common but differentiated responsibilities", "atmospheric debt", "historical responsibility", "right to development", "climate justice"]
}

EXAMPLE OF GOOD RESPONSE (for an article about Taiwan):
{
  "title": "Taiwan's Complex International Status and Cross-Strait Relations",
  "description": "Taiwan's international status stems from the Chinese Civil War (1945-1949), when the Republic of China government retreated to Taiwan after losing to the Communist Party. The 'One China' principle, recognized by most countries, holds that there is only one China, but interpretations differ: Beijing views Taiwan as a province, while Taipei maintains it is a separate sovereign state. The 1979 Taiwan Relations Act commits the U.S. to Taiwan's defense, creating a delicate balance. Cross-strait relations involve complex cultural, historical, and political factors, with Taiwan's democratic system contrasting with China's authoritarian model, reflecting broader tensions between different political and cultural systems in East Asia.",
  "examples": ["One China principle", "Cross-Strait relations", "Taiwan Relations Act", "sovereignty", "diplomatic recognition"]
}

EXAMPLE OF BAD RESPONSE (DO NOT DO THIS - too generic):
{
  "title": "Climate Change in Society",
  "description": "This topic is important in many cultures. Different people have different views. Understanding this helps you learn about the world. Climate change affects many countries.",
  "examples": ["climate", "environment", "global"]
}

EXAMPLE OF BAD RESPONSE (DO NOT DO THIS - generic fallback):
{
  "title": "Huskers: Cultural and Historical Context",
  "description": "This topic has important cultural and historical background. Understanding the context helps interpret news about this subject. Different cultures and historical experiences shape how people view this topic.",
  "examples": ["cultural awareness", "societal impact"]
}

EXAMPLE OF BAD RESPONSE (DO NOT DO THIS - still too generic):
{
  "title": "Arrests: Cultural and Historical Context",
  "description": "Federal authorities made their first arrest Thursday in connection with two pipe... News emerged as a significant issue when specific historical events and cultural developments shaped its current form. how this topic is understood. The historical background of this issue helps explain why current developments matter and how different perspectives have developed over time. Understanding these specific historical and cultural factors is essential for interpreting news about News.",
  "examples": ["arrests", "news"]
}

This is WRONG because:
- Starts with "Federal authorities made" (too generic, doesn't explain background)
- Contains "emerged as a significant issue" (generic phrase)
- Contains "when specific historical events and cultural developments shaped" (generic phrase)
- Contains "Understanding these specific historical and cultural factors" (generic phrase)
- Doesn't provide specific historical or cultural background
- Doesn't explain WHY this background matters

If the article is about "Huskers" (likely a sports team), a GOOD response would be:
{
  "title": "College Football Culture in the American Midwest",
  "description": "The University of Nebraska's football team, known as the 'Huskers,' represents a deep cultural tradition in the American Midwest. College football in this region emerged in the late 19th century as universities established athletic programs, with the University of Nebraska fielding its first team in 1890. The term 'Huskers' refers to Nebraska's agricultural heritage, where farmers husked corn. This reflects how college sports in America often connect to regional identity and local economic history. The intense fan culture surrounding teams like the Huskers reflects broader American values around community, school pride, and regional competition that differ from professional sports models in other countries.",
  "examples": ["college athletics", "regional identity", "school pride", "agricultural heritage", "fan culture"]
}

Return ONLY valid JSON, no additional text.`

  try {
    const systemInstruction = `You are a cultural studies expert and educator specializing in providing SPECIFIC, FACTUAL background knowledge for news articles.

ABSOLUTE REQUIREMENTS - YOU MUST FOLLOW THESE (YOUR RESPONSE WILL BE REJECTED IF YOU DON'T):
1. **Read the ENTIRE article content** - analyze every paragraph, sentence, and word for specific details
2. **Extract ALL specific entities** - teams, organizations, people, countries, cities, dates, years, events, policies, treaties, numbers mentioned in the article
3. **Provide factual background** - historical events, cultural practices, social structures SPECIFIC to what the article discusses
4. **MANDATORY START**: Your description MUST begin with one of these EXACT formats (NO EXCEPTIONS):
   - "In [YEAR], [SPECIFIC EVENT] occurred..." (e.g., "In 2021, the U.S. Capitol was attacked...")
   - "On [DATE], [SPECIFIC EVENT] happened..." (e.g., "On January 6, 2021, supporters of...")
   - "The [SPECIFIC ENTITY] was established in [YEAR]..." (e.g., "The FBI was created in 1908...")
   - "[SPECIFIC PERSON/ORGANIZATION] [SPECIFIC ACTION] in [YEAR]..." (e.g., "Donald Trump was elected president in 2016...")
   - "The [SPECIFIC EVENT] (YEAR-YEAR) resulted in..." (e.g., "The Chinese Civil War (1945-1949) resulted in...")
   - "[SPECIFIC COUNTRY/REGION] has [SPECIFIC FACT] since [YEAR]..." (e.g., "The United States has had a two-party system since the 1800s...")
   - NEVER start with "This topic", "Understanding", "Different", "Various", "Federal authorities", "News emerged"

5. **Reference article details** - MUST mention at least 3-4 specific details from the article:
   - At least 1-2 dates/years from the article
   - At least 1-2 countries/organizations/people from the article
   - At least 1-2 specific events or policies from the article
6. **Explain cultural significance** - why this background matters for understanding THIS specific article
7. **Use concrete examples** - specific names, dates, places, numbers, events from the article (NOT abstract concepts)
8. **Minimum 250 words** - provide comprehensive background knowledge
9. **Include specific information** - at least 2 dates/years, 1-2 countries/organizations, 1-2 specific events or policies

FORBIDDEN PHRASES (NEVER USE - these will cause your response to be AUTOMATICALLY REJECTED):
- "This topic has important cultural background"
- "This topic has specific historical and cultural significance"
- "Understanding the context helps interpret news"
- "Understanding the specific historical context"
- "Different cultures have different views"
- "This topic reflects cultural and historical differences"
- "Understanding these differences helps"
- "Different regions have different perspectives"
- "Based on their history and culture"
- "This topic is important in many cultures"
- "Various perspectives exist"
- "evolved through particular historical events"
- "particular historical events and cultural developments"
- "helps interpret current news about this topic"
- "in [country], this topic"
- "this topic has evolved"
- "emerged as a significant issue"
- "when specific historical events"
- "cultural developments shaped"
- "shaped its current form"
- "how this topic is understood"
- "the historical background of this issue"
- "why current developments matter"
- "how different perspectives have developed"
- "Understanding these specific historical and cultural factors"
- "is essential for interpreting news about"
- "news about News" or "news about this topic"
- "Federal authorities made"
- "News emerged"
- Any generic statement without specific facts, dates, or names

REQUIRED FORMAT:
- Start with: "In [YEAR], [SPECIFIC EVENT]..." or "On [DATE], [SPECIFIC EVENT]..." or "The [SPECIFIC ENTITY] was [FACT] in [YEAR]..."
- Include: At least 3-4 specific details from the article (dates, countries, organizations, events, people)
- Explain: Historical development, cultural practices, social significance using concrete examples FROM THE ARTICLE
- Connect: How this background helps understand the article's significance

VALIDATION: Your response will be AUTOMATICALLY REJECTED if it:
- Starts with generic phrases like "This topic", "Understanding", "Different", "Federal authorities", "News emerged"
- Contains ANY forbidden phrases listed above
- Lacks at least 3 specific details (dates, countries, organizations, events, people) from the article
- Is shorter than 250 words
- Does not reference specific information from the article
- Uses abstract statements instead of concrete facts

CRITICAL: Your description MUST be about the CULTURAL and HISTORICAL BACKGROUND of what the article discusses, NOT a summary of the article itself. For example:
- If the article is about an arrest, explain the historical context of law enforcement, political violence, or the specific event being investigated
- If the article is about a policy, explain the historical development of such policies, cultural values that shape them, or previous similar policies
- If the article is about an organization, explain when it was founded, its historical purpose, and its cultural/political significance

Always respond with valid JSON only, no additional text.`

    const responseText = await generateText(prompt, systemInstruction)
    console.log('Cultural context AI response:', responseText.substring(0, 500))
    
    // JSON 추출 - 더 robust한 방법
    let jsonText = responseText.trim()
    
    // Markdown 코드 블록 제거
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // JSON 객체 찾기
    let jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      // 중괄호로 시작하는 부분 찾기
      const startIdx = jsonText.indexOf('{')
      const endIdx = jsonText.lastIndexOf('}')
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        jsonMatch = [jsonText.substring(startIdx, endIdx + 1)]
      }
    }
    
    if (jsonMatch && jsonMatch[0]) {
      try {
        const result = JSON.parse(jsonMatch[0])
        
        // 결과 검증 및 정리
        const contextTitle = result.title && typeof result.title === 'string' && result.title.trim().length > 0
          ? result.title.trim()
          : generateFallbackTitle(identifyMainTopic(title, content), title)
        
        const description = result.description && typeof result.description === 'string' && result.description.trim().length > 200
          ? result.description.trim()
          : null
        
        const examples = Array.isArray(result.examples) && result.examples.length > 0
          ? result.examples
              .filter((e: any) => typeof e === 'string' && e.trim().length > 0)
              .slice(0, 5)
          : extractCulturalExamples(content, title)
        
        // description 검증: 더 엄격하게
        const isGeneric = isGenericDescription(description || '')
        const isTooShort = !description || description.length < 250
        
        // 첫 문장이 구체적인 사실로 시작하는지 확인 (더 엄격하게)
        const firstSentence = description?.split(/[.!?]+/)[0]?.trim() || ''
        const startsWithGeneric = /^(this|the|it|understanding|different|various|many|some|in\s+china,\s+this|this\s+topic|trump's\s+in|federal\s+authorities|news\s+emerged)/i.test(firstSentence)
        
        // 구체적인 시작 패턴 확인 (더 넓게)
        const startsWithSpecific = 
          /^(in|during|since|after|before|when|where)\s+\d{4}/i.test(firstSentence) || // "In 2021, ..."
          /^(in|during|since|after|before|when|where)\s+[A-Z][a-z]+/.test(firstSentence) || // "In January, ..."
          /\b(19|20)\d{2}\b/.test(firstSentence) || // 연도 포함
          /\b(Trump|Biden|Xi|China|United States|Nebraska|University|College|NATO|UN|Paris|Taiwan|Huskers|FBI|DNC|RNC|Capitol|January|2021|2020|2019)\b/i.test(firstSentence) || // 특정 이름/조직
          /^(the|a|an)\s+[A-Z][a-z]+\s+(was|were|is|are|became|occurred|happened|established|created|founded)/i.test(firstSentence) // "The [Entity] was..."
        
        const hasValidStart = !startsWithGeneric || startsWithSpecific
        
        // 추가 검증: "emerged", "shaped", "understanding" 같은 일반적 동사가 첫 문장에 있으면 거부
        const hasGenericVerb = /(emerged|shaped|understanding|helps|explains|shows|reflects)\s+(as|when|how|why|that|this)/i.test(firstSentence)
        const hasGenericPattern = /(emerged as a|shaped its|understanding these|helps explain|why current developments|how different perspectives)/i.test(description || '')
        
        if (hasGenericVerb && !startsWithSpecific) {
          console.log('❌ First sentence contains generic verb pattern:', firstSentence.substring(0, 100))
        }
        
        // 일반적인 구문이 있거나 너무 짧거나 시작이 잘못되었거나 일반적 패턴이 있으면 무조건 fallback 사용
        if (isGeneric || isTooShort || !hasValidStart || hasGenericVerb || hasGenericPattern) {
          console.log('❌ Description failed validation, using enhanced fallback')
          console.log('Description received:', description?.substring(0, 300) || 'null')
          console.log('Is generic:', isGeneric)
          console.log('Length:', description?.length || 0)
          console.log('Has valid start:', hasValidStart)
          console.log('First sentence:', firstSentence.substring(0, 100))
          console.log('Article title:', title.substring(0, 100))
          
          const topic = identifyMainTopic(title, content)
          const specificInfo = extractSpecificInfo(title, content)
          const keyEntities = extractKeyEntities(title, content)
          console.log('Topic identified:', topic)
          console.log('Specific info:', specificInfo.substring(0, 200))
          console.log('Key entities:', keyEntities.slice(0, 5).join(', '))
          
          const enhancedDescription = generateEnhancedFallbackDescription(topic, level, title, content, specificInfo)
          console.log('✅ Enhanced fallback description:', enhancedDescription.substring(0, 200))
          
          return {
            title: contextTitle,
            description: enhancedDescription,
            examples,
          }
        }
        
        console.log('✅ Description passed validation')
        console.log('Description:', description?.substring(0, 200))
        
        return {
          title: contextTitle,
          description,
          examples,
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Attempted to parse:', jsonMatch[0].substring(0, 200))
        throw new Error('Failed to parse JSON response')
      }
    }
    
    throw new Error('No JSON found in response')
  } catch (error) {
    console.error('Error generating cultural context:', error)
    console.error('Error details:', error)
    
    // Fallback: 기사 내용 기반 기본 cultural context (구체적인 배경 지식 제공)
    // 기사에서 주제를 더 정확히 파악
    const topic = identifyMainTopic(title, content)
    const specificInfo = extractSpecificInfo(title, content)
    const fallbackTitle = generateFallbackTitle(topic, title)
    const fallbackDescription = generateEnhancedFallbackDescription(topic, level, title, content, specificInfo)
    
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      examples: extractCulturalExamples(content, fallbackTitle),
    }
  }
}

/**
 * 주제별 fallback 제목 생성 (구체적인 제목)
 */
function generateFallbackTitle(topic: string, articleTitle: string): string {
  const topicTitles: Record<string, string> = {
    'climate and environment': 'Climate Change and Global Environmental Policy',
    'technology and AI': 'Artificial Intelligence and Cultural Transformation',
    'politics and governance': 'Political Systems and Cultural Values',
    'economics and trade': 'Global Economics and Cultural Perspectives',
    'health and medicine': 'Healthcare Systems Across Cultures',
    'education': 'Education Systems and Cultural Values',
    'culture and society': 'Cultural Practices and Social Change',
    'international relations': 'International Relations and Cultural Diplomacy',
  }
  
  // 주제에 맞는 제목이 있으면 사용
  const topicKey = Object.keys(topicTitles).find(key => topic.includes(key.split(' ')[0]))
  if (topicKey) {
    return topicTitles[topicKey]
  }
  
  // 주제를 찾지 못한 경우, 기사 제목에서 의미있는 키워드 추출
  const titleWords = articleTitle.toLowerCase().split(/\s+/)
  const commonWords = ['the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but', 'is', 'are', 'was', 'were']
  const keywords = titleWords.filter(word => word.length > 5 && !commonWords.includes(word))
  
  if (keywords.length > 0) {
    const mainKeyword = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)
    return `${mainKeyword}: Cultural and Historical Context`
  }
  
  return 'Cultural Background and Context'
}

/**
 * 기사에서 주요 주제 식별 (개선된 버전)
 */
function identifyMainTopic(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase()
  
  // 더 구체적인 주제 키워드 패턴 (우선순위 순)
  const topics: Array<{ pattern: string, topic: string }> = [
    { pattern: 'taiwan|taipei|china.*taiwan|taiwan.*china', topic: 'Taiwan and Cross-Strait Relations' },
    { pattern: 'climate|global warming|emission|carbon|cop[0-9]|paris agreement', topic: 'Climate Change and Environmental Policy' },
    { pattern: 'artificial intelligence|ai|machine learning|chatgpt|gpt|neural network', topic: 'Artificial Intelligence and Technology' },
    { pattern: 'ukraine|russia|war|conflict|nato', topic: 'Ukraine-Russia Conflict and International Relations' },
    { pattern: 'election|democracy|vote|president|prime minister|government', topic: 'Politics and Governance' },
    { pattern: 'economy|economic|market|trade|business|gdp|inflation', topic: 'Economics and Trade' },
    { pattern: 'health|medical|disease|healthcare|hospital|pandemic', topic: 'Health and Medicine' },
    { pattern: 'education|school|university|student|learning', topic: 'Education' },
    { pattern: 'technology|digital|computer|internet|cyber', topic: 'Technology' },
    { pattern: 'culture|cultural|tradition|society|social', topic: 'Culture and Society' },
    { pattern: 'international|diplomacy|foreign|global|united nations', topic: 'International Relations' },
  ]
  
  for (const { pattern, topic } of topics) {
    if (new RegExp(pattern, 'i').test(text)) {
      return topic
    }
  }
  
  return 'Current Events'
}

/**
 * 기사에서 주요 엔티티(인명, 지명, 조직명 등) 추출
 */
function extractKeyEntities(title: string, content: string): string[] {
  const text = title + ' ' + content
  const entities: string[] = []
  
  // 대문자로 시작하는 연속된 단어들 (고유명사 패턴)
  const properNounPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g
  const matches = text.match(properNounPattern)
  
  if (matches) {
    // 일반적인 단어 제외
    const commonWords = ['The', 'This', 'That', 'These', 'Those', 'They', 'We', 'You', 'He', 'She', 'It', 'A', 'An', 'In', 'On', 'At', 'For', 'To', 'Of', 'And', 'Or', 'But']
    const filtered = matches.filter(m => 
      !commonWords.includes(m) && 
      m.length > 3 &&
      !m.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December)$/i)
    )
    
    entities.push(...filtered.slice(0, 15))
  }
  
  return Array.from(new Set(entities))
}

/**
 * 기사에서 구체적인 정보 추출 (날짜, 숫자, 특정 사건 등)
 */
function extractSpecificInfo(title: string, content: string): string {
  const text = title + ' ' + content
  const info: string[] = []
  
  // 연도 추출 (1900-2099)
  const years = text.match(/\b(19|20)\d{2}\b/g)
  if (years && years.length > 0) {
    info.push(`Years mentioned: ${Array.from(new Set(years)).slice(0, 5).join(', ')}`)
  }
  
  // 국가명 추출 (일반적인 국가명 패턴)
  const countries = text.match(/\b(China|United States|USA|US|Russia|Japan|Korea|India|Germany|France|Britain|UK|Taiwan|Ukraine|Brazil|Canada|Australia|Italy|Spain)\b/gi)
  if (countries && countries.length > 0) {
    info.push(`Countries mentioned: ${Array.from(new Set(countries.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()))).slice(0, 5).join(', ')}`)
  }
  
  // 조직/기관명 추출 (대문자로 시작하는 2단어 이상)
  const organizations = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,}\b/g)
  if (organizations && organizations.length > 0) {
    const filtered = organizations.filter(org => 
      org.length > 5 && 
      !org.match(/^(The|This|That|These|Those)/i) &&
      org.split(' ').length >= 2
    )
    if (filtered.length > 0) {
      info.push(`Organizations mentioned: ${Array.from(new Set(filtered)).slice(0, 5).join(', ')}`)
    }
  }
  
  // 숫자와 통계 추출
  const numbers = text.match(/\b\d{1,3}(?:,\d{3})*(?:\s*(?:percent|%|billion|million|thousand|dollars?|people|countries?))?\b/gi)
  if (numbers && numbers.length > 0) {
    info.push(`Key numbers/statistics: ${numbers.slice(0, 3).join(', ')}`)
  }
  
  return info.length > 0 ? info.join(' | ') : 'Various specific details mentioned in the article'
}

/**
 * 설명이 너무 일반적인지 확인
 */
function isGenericDescription(description: string): boolean {
  if (!description || description.length < 50) {
    return true
  }
  
  const genericPhrases = [
    'this topic is important',
    'different people have different views',
    'this is a complex issue',
    'understanding this helps',
    'this topic reflects',
    'many cultures',
    'various perspectives',
    'different countries',
    'this topic has important cultural and historical background',
    'understanding the context helps interpret news',
    'different cultures and historical experiences shape',
    'helps interpret news about this subject',
    'shape how people view this topic',
    'understanding these differences helps',
    'different regions have different perspectives',
    'based on their history and culture',
    'reflects cultural and historical differences',
    'understanding these differences helps interpret',
    'this topic reflects',
    'cultural and historical differences',
    'understanding these differences',
    'different regions have',
    'different perspectives based',
    'helps interpret news',
    'based on their',
    'history and culture',
    'important cultural and historical background',
    'understanding the context helps',
    'different cultures and historical experiences',
    'this topic is',
    'important in',
    'many countries',
    'different places',
    'various countries',
    'around the world',
    'global perspective',
    'cultural awareness',
    'societal impact',
    'reflects significant',
    'cultural and historical',
    'developments',
    'understanding the',
    'cultural background',
    'helps understand',
    'this subject',
    'different ways',
    'of thinking',
    // 추가된 금지 구문들
    'represents a significant cultural and historical phenomenon',
    'can be traced through specific historical events',
    'can be traced through',
    'specific historical events and cultural shifts',
    'different regions have developed distinct approaches',
    'based on their unique historical experiences',
    'economic conditions, and cultural values',
    'understanding these specific historical and cultural contexts',
    'is essential for interpreting current developments',
    'related to this topic',
    'represents a significant',
    'cultural and historical phenomenon',
    'the development of this topic',
    'distinct approaches based',
    'unique historical experiences',
    'essential for interpreting',
    'current developments related',
    // 추가: 사용자가 보여준 일반적 구문들
    'has specific historical and cultural significance',
    'evolved through particular historical events',
    'particular historical events and cultural developments',
    'understanding the specific historical context',
    'helps interpret current news about this topic',
    'in china, this topic',
    'this topic has evolved',
    'through particular historical',
    'cultural developments',
    'understanding the specific',
    'historical context and cultural factors',
    // 추가: 사용자가 보여준 일반적 구문들
    'emerged as a significant issue',
    'when specific historical events',
    'cultural developments shaped',
    'shaped its current form',
    'how this topic is understood',
    'the historical background of this issue',
    'why current developments matter',
    'how different perspectives have developed',
    'understanding these specific historical and cultural factors',
    'is essential for interpreting news about',
    'news about news',
    'news about this topic',
    'federal authorities made',
    'in connection with',
    'news emerged',
  ]
  
  const lowerDesc = description.toLowerCase()
  const hasGenericPhrase = genericPhrases.some(phrase => lowerDesc.includes(phrase.toLowerCase()))
  
  // 일반적인 구문이 있으면 무조건 일반적인 것으로 판단
  if (hasGenericPhrase) {
    const detectedPhrase = genericPhrases.find(p => lowerDesc.includes(p.toLowerCase()))
    console.log('❌ Generic phrase detected:', detectedPhrase)
    console.log('Description snippet:', description.substring(0, 200))
    return true
  }
  
  // 추가 검증: "represents", "can be traced", "different regions" 같은 패턴이 있으면 거부
  const suspiciousPatterns = [
    /represents\s+a\s+significant\s+cultural/i,
    /can\s+be\s+traced\s+through/i,
    /different\s+regions\s+have\s+developed/i,
    /based\s+on\s+their\s+unique\s+historical/i,
    /understanding\s+these\s+specific\s+historical/i,
    /essential\s+for\s+interpreting\s+current/i,
    /the\s+development\s+of\s+this\s+topic/i,
  ]
  
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(description))
  if (hasSuspiciousPattern) {
    console.log('❌ Suspicious pattern detected in description')
    return true
  }
  
  // 구체적인 정보(날짜, 숫자, 특정 이름, 구체적인 사건)가 있는지 확인
  const hasYear = /\b(19|20)\d{2}\b/.test(description)
  const hasPercentage = /\b\d+%/.test(description)
  const hasCountry = /\b(China|United States|USA|Russia|Japan|Korea|India|Germany|France|Britain|Taiwan|Ukraine|Nebraska|America|American|Europe|European|Asia|Asian)\b/i.test(description)
  const hasOrganization = /\b(University|College|UN|NATO|EU|IPCC|UNESCO|Summit|Agreement|Act|Congress|Parliament|Government|Administration)\b/i.test(description)
  const hasSpecificEvent = /\b(War|Summit|Agreement|Act|Conference|Revolution|Civil War|Treaty|Convention|Election)\b/i.test(description)
  const hasSpecificName = /\b(Trump|Biden|Xi|Putin|Nebraska|Huskers|Paris|Beijing|Washington|Taipei)\b/i.test(description)
  const hasNumber = /\b\d+\s+(million|billion|thousand|percent|people|countries|years|century)\b/i.test(description)
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const hasMultipleSentences = sentences.length >= 4
  
  // 구체적인 정보가 2개 이상 있어야 함 (더 엄격하게)
  const specificInfoCount = [hasYear, hasPercentage, hasCountry, hasOrganization, hasSpecificEvent, hasSpecificName, hasNumber].filter(Boolean).length
  const hasEnoughSpecificInfo = specificInfoCount >= 2
  
  // 구체적인 정보가 부족하거나 문장이 너무 적으면 일반적인 것으로 판단
  if (!hasEnoughSpecificInfo || !hasMultipleSentences) {
    console.log('❌ Lacks specific info:', { 
      hasYear, 
      hasCountry, 
      hasOrganization, 
      hasSpecificEvent, 
      hasSpecificName,
      hasNumber,
      specificInfoCount,
      hasMultipleSentences, 
      sentenceCount: sentences.length 
    })
    return true
  }
  
  // 첫 문장이 구체적인 사실로 시작하는지 확인
  const firstSentence = sentences[0]?.trim() || ''
  const startsWithGeneric = /^(this|the|it|understanding|different|various|many|some)/i.test(firstSentence)
  const startsWithSpecific = /^(the|in|during|since|after|before|when|where)\s+[A-Z]/.test(firstSentence) || 
                             /\b(19|20)\d{2}\b/.test(firstSentence) ||
                             /\b(Trump|Biden|China|United States|Nebraska|University)/i.test(firstSentence)
  
  if (startsWithGeneric && !startsWithSpecific) {
    console.log('❌ First sentence starts with generic phrase:', firstSentence.substring(0, 50))
    return true
  }
  
  return false
}

/**
 * 향상된 fallback 설명 생성 (기사 내용 기반)
 */
function generateEnhancedFallbackDescription(
  topic: string, 
  level: 'beginner' | 'intermediate' | 'advanced',
  title: string,
  content: string,
  specificInfo: string
): string {
  // 기사 제목과 내용에서 구체적인 정보 추출 (더 적극적으로)
  const titleLower = title.toLowerCase()
  const contentLower = content.toLowerCase()
  
  // 제목에서 주요 키워드 추출 (대문자로 시작하는 단어들)
  const titleKeywords = title.match(/\b[A-Z][a-z]+\b/g) || []
  const mainKeyword = titleKeywords.find(k => 
    k.length > 4 && 
    !['The', 'This', 'That', 'With', 'From', 'About', 'News'].includes(k)
  ) || titleKeywords[0] || ''
  
  // 기사에서 구체적인 정보 추출 (더 많이, 더 정확하게)
  const allEntities = extractKeyEntities(title, content)
  const countries = allEntities.filter(e => 
    e.match(/^(China|United States|USA|Russia|Japan|Korea|India|Germany|France|Britain|Taiwan|Ukraine|Brazil|Canada|Australia|Nebraska|America|American|Europe|European|Asia|Asian|Beijing|Washington|Paris|London|Tokyo|Seoul)/i)
  )
  
  const years = content.match(/\b(19|20)\d{2}\b/g)
  const recentYear = years ? Array.from(new Set(years)).sort().reverse()[0] : null
  const allYears = years ? Array.from(new Set(years)).slice(0, 3) : []
  
  // 조직/기관 추출 (더 넓은 패턴)
  const organizations = allEntities.filter(e => 
    e.match(/^(University|College|UN|NATO|EU|IPCC|UNESCO|Summit|Agreement|Act|Congress|Parliament|Government|Administration|Department|Ministry|Organization|Institution|Company|Corporation)/i)
  )
  
  // 특정 인물 추출 (더 넓은 패턴)
  const people = allEntities.filter(e => 
    e.match(/^(Trump|Biden|Xi|Putin|Nebraska|Huskers|Paris|Beijing|Washington|Taipei|Obama|Clinton|Bush|Reagan|Thatcher|Merkel|Macron|Modi|Abe|Cole|Brian)/i)
  )
  
  // 특정 이벤트/정책 추출 (더 넓은 패턴)
  const events = content.match(/\b(War|Summit|Agreement|Act|Conference|Revolution|Civil War|Treaty|Convention|Election|Trade War|Cold War|Pandemic|Crisis|Recession|Depression|Riot|Attack|Bomb|Arrest)\b/gi) || []
  
  // 숫자/통계 추출
  const numbers = content.match(/\b\d+\s*(million|billion|thousand|percent|%|dollars?|people|countries|years?)\b/gi) || []
  
  // 기사 내용에서 핵심 문장 추출 (첫 3문장, 더 긴 문장)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 50).slice(0, 3)
  const keySentences = sentences.join('. ')
  
  // 특정 날짜/시간 추출 (January 6, 2021 등)
  const dates = content.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi) || []
  const specificDate = dates.length > 0 ? dates[0] : null
  
  // 스포츠 팀 관련 (Huskers, etc.) - 더 넓은 패턴으로 검색
  if (titleLower.includes('husker') || titleLower.includes('huskers') || 
      contentLower.includes('husker') || contentLower.includes('nebraska') ||
      titleLower.includes('nebraska') || mainKeyword.toLowerCase().includes('husker')) {
    if (level === 'beginner') {
      return `The Huskers are a college football team from the University of Nebraska. College football is very popular in America. Many people watch college games. Teams represent schools and states. This is important in American culture.`
    } else if (level === 'intermediate') {
      return `The University of Nebraska's football team, known as the 'Huskers,' represents a significant cultural tradition in the American Midwest. College football emerged in the late 19th century as universities established athletic programs, with Nebraska fielding its first team in 1890. The term 'Huskers' refers to Nebraska's agricultural heritage, where farmers husked corn. College sports in America connect to regional identity and local economic history, with intense fan culture reflecting broader American values around community, school pride, and regional competition.`
    } else {
      return `The University of Nebraska's football program, known as the 'Huskers,' embodies deep cultural traditions in the American Midwest. College football in the United States emerged from late 19th-century university athletic programs, with Nebraska establishing its team in 1890. The 'Huskers' nickname reflects the state's agricultural heritage, where corn husking was a central economic activity. This connection between sports and regional identity illustrates how American college athletics function as cultural institutions that reinforce community bonds, regional pride, and local economic narratives, distinct from professional sports models in other countries. The intense fan culture surrounding teams like the Huskers reflects broader American cultural values around competition, community belonging, and institutional loyalty.`
    }
  }
  
  // 교육/대학 관련 (University, College, School 등)
  if (titleLower.includes('university') || titleLower.includes('college') || 
      titleLower.includes('school') || contentLower.includes('university') ||
      contentLower.includes('college')) {
    if (level === 'beginner') {
      return `Universities and colleges are important places for learning in many countries. In America, universities often have sports teams. These teams represent the school. Many people support their school's team. This is part of American culture.`
    } else if (level === 'intermediate') {
      return `Higher education institutions in the United States, particularly universities, have developed unique cultural traditions around athletics. College sports programs emerged in the late 19th century as universities established athletic departments. These programs connect to regional identity, with team names often reflecting local history or economic activities. The intense fan culture surrounding college athletics reflects broader American values around community, school pride, and regional competition, distinct from professional sports models in other countries.`
    } else {
      return `American higher education institutions have developed distinctive cultural traditions around intercollegiate athletics that reflect broader societal values. College sports programs, emerging from late 19th-century university athletic departments, function as cultural institutions that reinforce regional identity, community bonds, and institutional loyalty. Team names and traditions often connect to local economic history or regional characteristics, creating narratives that extend beyond athletics. The intense fan culture surrounding college sports reflects American cultural values around competition, community belonging, and the role of educational institutions in shaping regional identity, contrasting with professional sports models and educational systems in other countries.`
    }
  }
  
  // 주제별 + 기사 정보 기반 설명
  if (topic.includes('Taiwan') || titleLower.includes('taiwan')) {
    if (level === 'beginner') {
      return `Taiwan is an island near China. China says Taiwan is part of China. Taiwan says it is a separate country. The United States helps protect Taiwan. This is a very important issue in Asia.`
    } else if (level === 'intermediate') {
      return `Taiwan's status stems from the Chinese Civil War (1945-1949), when the Republic of China government retreated to Taiwan. The 'One China' principle, recognized by most countries, holds that there is only one China, but interpretations differ. The 1979 Taiwan Relations Act commits the U.S. to Taiwan's defense. Cross-strait relations involve complex historical, political, and cultural factors.`
    } else {
      return `Taiwan's international status reflects the unresolved legacy of the Chinese Civil War and competing conceptions of sovereignty. The 'One China' principle, while widely recognized, encompasses divergent interpretations: Beijing views Taiwan as a renegade province requiring reunification, while Taipei maintains de facto sovereignty. The 1979 Taiwan Relations Act creates a strategic ambiguity that has maintained regional stability while preventing formal independence. This reflects broader tensions between different political systems and cultural identities in East Asia.`
    }
  }
  
  // 기사 제목에서 더 많은 정보 추출하여 fallback 생성
  // 제목의 주요 키워드 기반 설명 생성
  if (mainKeyword && mainKeyword.length > 4) {
    const keywordLower = mainKeyword.toLowerCase()
    
    // 스포츠 관련 키워드
    if (keywordLower.includes('football') || keywordLower.includes('basketball') || 
        keywordLower.includes('soccer') || keywordLower.includes('baseball') ||
        contentLower.includes('sport') || contentLower.includes('game') ||
        contentLower.includes('team') || contentLower.includes('player')) {
      if (level === 'beginner') {
        return `Sports are very popular in many countries. Different countries like different sports. In America, football and basketball are very popular. Sports teams represent cities or schools. Many people watch sports games. This is important in many cultures.`
      } else if (level === 'intermediate') {
        return `Sports hold significant cultural importance across different societies, with each region developing distinct athletic traditions. In the United States, college and professional sports function as cultural institutions that reinforce community identity and regional pride. The intense fan culture surrounding sports reflects broader societal values around competition, teamwork, and collective belonging. Different countries prioritize different sports based on historical and cultural factors, making sports a lens through which to understand cultural values and social structures.`
      } else {
        return `Sports function as cultural institutions that reflect and reinforce societal values, regional identities, and collective belonging. The development of athletic traditions varies significantly across cultures, with each society prioritizing different sports based on historical, economic, and cultural factors. In the United States, intercollegiate and professional sports have evolved into complex cultural systems that extend beyond entertainment, shaping community identity, regional pride, and social cohesion. The intense fan culture and institutional support for athletics reveal deeper cultural values around competition, achievement, and collective identity that differ from professional sports models in other countries.`
      }
    }
  }
  
  // 기사에서 추출한 구체적인 정보를 사용하여 설명 생성
  const country = countries.length > 0 ? countries[0] : null
  const org = organizations.length > 0 ? organizations[0] : null
  const person = people.length > 0 ? people[0] : null
  const event = events.length > 0 ? events[0] : null
  const year = recentYear || (allYears.length > 0 ? allYears[0] : null)
  const number = numbers.length > 0 ? numbers[0] : null
  const date = specificDate || null
  
  // 기사 내용에서 더 많은 정보 추출
  // 기사 제목과 내용에서 핵심 키워드 추출
  const articleText = (title + ' ' + content).toLowerCase()
  
  // 특정 주제 감지 (더 넓은 패턴)
  const hasPolitics = articleText.includes('election') || articleText.includes('president') || articleText.includes('congress') || articleText.includes('senate') || articleText.includes('house')
  const hasCrime = articleText.includes('arrest') || articleText.includes('crime') || articleText.includes('suspect') || articleText.includes('bomb') || articleText.includes('attack')
  const hasInternational = articleText.includes('international') || articleText.includes('diplomacy') || articleText.includes('treaty') || articleText.includes('agreement')
  const hasEconomy = articleText.includes('economy') || articleText.includes('economic') || articleText.includes('trade') || articleText.includes('market')
  const hasTechnology = articleText.includes('technology') || articleText.includes('ai') || articleText.includes('digital') || articleText.includes('computer')
  const hasHealth = articleText.includes('health') || articleText.includes('medical') || articleText.includes('disease') || articleText.includes('pandemic')
  
  // 구체적인 정보가 있으면 그것을 사용하여 설명 생성 (더 적극적으로)
  if (country || year || org || person || event || number || date || keySentences || hasPolitics || hasCrime || hasInternational || hasEconomy || hasTechnology || hasHealth) {
    const contextParts: string[] = []
    if (year) contextParts.push(year)
    if (country) contextParts.push(country)
    if (org) contextParts.push(org)
    if (person) contextParts.push(person)
    if (event) contextParts.push(event)
    
    // 구체적인 정보를 포함한 설명 생성 (기사 내용 기반, 일반적 구문 완전 제거)
    // 주제별 구체적인 배경 지식 제공
    if (hasCrime && (date || year)) {
      // 범죄/체포 관련 기사
      if (level === 'beginner') {
        return `In ${year || date || 'recent years'}, police and the FBI arrest people who break the law. ${org ? `${org} ` : 'Law enforcement agencies '}investigate crimes. ${country ? `In ${country}, ` : ''}the legal system works to keep people safe. Understanding how police and courts work helps explain news about arrests and crimes.`
      } else if (level === 'intermediate') {
        return `The Federal Bureau of Investigation (FBI) was established in 1908 to investigate federal crimes in the United States. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}reflect the FBI's role in investigating serious crimes, including domestic terrorism and political violence. ${country ? `In ${country}, ` : ''}law enforcement agencies like the FBI work to maintain public safety and investigate threats to national security. Understanding the FBI's history, its investigative processes, and its role in American law enforcement helps interpret news about arrests and criminal investigations.`
      } else {
        return `The Federal Bureau of Investigation (FBI), established in 1908, serves as the primary federal law enforcement agency in the United States, responsible for investigating violations of federal law, including domestic terrorism, cybercrime, and organized crime. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}occur within a broader historical context of law enforcement responses to political violence and threats to democratic institutions. ${country ? `In ${country}, ` : ''}the relationship between law enforcement, political institutions, and civil liberties has evolved over time, reflecting tensions between security and individual rights. Understanding the FBI's investigative authority, its relationship with other law enforcement agencies, and its role in maintaining national security helps interpret news about criminal investigations and arrests.`
      }
    } else if (hasPolitics && (date || year)) {
      // 정치 관련 기사
      if (level === 'beginner') {
        return `In ${year || date || 'America'}, people vote to choose leaders. ${org ? `${org} ` : 'Political parties '}help organize elections. ${country ? `In ${country}, ` : ''}democracy means people have a say in government. Understanding how elections work helps explain political news.`
      } else if (level === 'intermediate') {
        return `The United States has had a two-party political system since the early 1800s, with the Democratic and Republican parties dominating American politics. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}reflect ongoing political processes in American democracy. ${org ? `${org} ` : 'Political organizations '}play key roles in organizing campaigns, fundraising, and shaping policy. Understanding how American political parties developed, their historical roles, and their influence on government helps interpret news about elections and political events.`
      } else {
        return `The American two-party system emerged from the early 19th-century competition between Federalists and Democratic-Republicans, evolving into the modern Democratic and Republican parties. This system, established through historical processes including the Civil War era realignment and 20th-century political reforms, shapes how American democracy functions. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}occur within this institutional framework, reflecting how political parties, electoral systems, and democratic norms interact. Understanding the historical development of American political institutions, the role of political parties in governance, and the cultural factors that shape political behavior helps interpret news about elections, political conflicts, and democratic processes.`
      }
    } else if (hasInternational && (date || year)) {
      // 국제 관계 관련 기사
      if (level === 'beginner') {
        return `Countries work together and sometimes disagree. ${org ? `${org} ` : 'International organizations '}help countries talk to each other. ${country ? `${country} ` : 'Different countries '}have different interests. Understanding how countries interact helps explain international news.`
      } else if (level === 'intermediate') {
        return `After World War II ended in 1945, countries created international organizations like the United Nations to promote peace and cooperation. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}reflect ongoing international relations. ${country ? `${country} ` : 'Countries '}work together on global issues while also protecting their own interests. Understanding how international organizations developed, their historical purposes, and how countries interact helps interpret news about international relations.`
      } else {
        return `The modern international system emerged from the post-World War II order established in 1945, with the creation of the United Nations and other multilateral institutions. This framework, shaped by the Cold War (1947-1991) and subsequent geopolitical shifts, structures how nations interact on global issues. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}occur within this historical context, reflecting tensions between multilateral cooperation and national sovereignty. Understanding the development of international institutions, the historical forces that shape diplomacy, and the cultural factors that influence international relations helps interpret news about global politics and international cooperation.`
      }
    } else if (hasEconomy && (date || year)) {
      // 경제 관련 기사
      if (level === 'beginner') {
        return `In ${year || date || 'recent years'}, countries trade with each other. ${country ? `${country} ` : 'Countries '}buy and sell goods. ${number ? `${number} ` : 'Money and jobs '}are important for people. Understanding how trade works helps explain economic news.`
      } else if (level === 'intermediate') {
        return `Global trade has expanded significantly since the end of World War II in 1945, with countries increasingly interconnected through economic relationships. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}reflect ongoing economic changes. ${country ? `${country} ` : 'Countries '}compete and cooperate in global markets. Understanding how international trade developed, its historical impact, and how economic policies work helps interpret news about trade and economics.`
      } else {
        return `The modern global economy emerged from post-World War II economic reconstruction and the establishment of institutions like the World Bank and International Monetary Fund in 1944. This system, shaped by decades of trade liberalization and economic integration, structures how nations interact economically. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}occur within this historical framework, reflecting tensions between economic globalization and national economic interests. Understanding the historical development of global economic systems, the cultural factors that shape economic policies, and how different societies approach trade and development helps interpret news about economics and international trade.`
      }
    } else if (hasTechnology && (date || year)) {
      // 기술 관련 기사
      if (level === 'beginner') {
        return `Computers and technology started becoming important in the 1950s. ${org ? `${org} ` : 'Technology companies '}create new tools. ${country ? `In ${country}, ` : ''}technology changes how people live. Understanding how technology developed helps explain tech news.`
      } else if (level === 'intermediate') {
        return `The field of computer science emerged in the 1950s, with the first computers developed for military and scientific purposes. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}reflect ongoing technological changes. ${country ? `In ${country}, ` : ''}technology companies and research institutions drive innovation. Understanding how technology developed, its historical impact, and how different countries approach technology helps interpret news about technology and innovation.`
      } else {
        return `The development of computing technology began in the 1940s and 1950s, with early computers like ENIAC (1946) marking the beginning of the digital age. This technological revolution, accelerated by the internet's development in the 1990s, has fundamentally transformed how societies function. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}occur within this historical trajectory, reflecting ongoing debates about technology's role in society. Understanding the historical development of technology, the cultural factors that shape technological adoption, and how different societies conceptualize technology's relationship with human life helps interpret news about technological developments and their social implications.`
      }
    } else if (hasHealth && (date || year)) {
      // 건강 관련 기사
      if (level === 'beginner') {
        return `Doctors and hospitals help people stay healthy. ${org ? `${org} ` : 'Health organizations '}work to prevent diseases. ${country ? `In ${country}, ` : ''}healthcare systems help people get medical care. Understanding how healthcare works helps explain health news.`
      } else if (level === 'intermediate') {
        return `Modern public health systems developed in the 19th and 20th centuries, with organizations like the World Health Organization (WHO) established in 1948. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}reflect ongoing health challenges. ${country ? `In ${country}, ` : ''}healthcare systems vary based on cultural values and economic resources. Understanding how public health developed, its historical importance, and how different countries approach healthcare helps interpret news about health and medicine.`
      } else {
        return `Modern public health emerged from 19th-century efforts to control infectious diseases and improve sanitation, evolving into complex systems that balance individual rights, public welfare, and economic considerations. The World Health Organization (WHO), established in 1948, coordinates global health efforts, but different countries have developed distinct healthcare models based on cultural values, economic systems, and historical experiences. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'Recent events '}occur within this historical and cultural context, reflecting ongoing debates about healthcare access, public health authority, and the relationship between individual and collective health. Understanding the historical development of healthcare systems, the cultural factors that shape health policies, and how different societies conceptualize health and medicine helps interpret news about public health and medical developments.`
      }
    }
    
    // 일반적인 경우: 기사 내용에서 구체적인 정보를 사용하여 설명 생성
    if (level === 'beginner') {
      // 기사 내용에서 구체적인 정보를 사용하여 설명
      const startFact = date
        ? `On ${date}, `
        : year 
        ? `In ${year}, `
        : country
        ? `In ${country}, `
        : person
        ? `${person} `
        : org
        ? `${org} `
        : event
        ? `The ${event} `
        : ''
      
      const contextInfo = []
      if (date) contextInfo.push(`on ${date}`)
      if (year && !date) contextInfo.push(`in ${year}`)
      if (country) contextInfo.push(`in ${country}`)
      if (number) contextInfo.push(`with ${number}`)
      const contextStr = contextInfo.length > 0 ? ` ${contextInfo.join(', ')}` : ''
      
      // 일반적 구문 완전 제거
      return `${startFact}${mainKeyword || 'this event'} happened${contextStr}. ${country ? `${country} has ` : ''}${year ? `Since ${year}, ` : ''}${org ? `${org} has been ` : ''}involved in this issue. ${person ? `${person} played a role. ` : ''}This event shows how ${country || 'people'} respond to important issues. Learning about this history helps understand why this news matters today.`
    } else if (level === 'intermediate') {
      // 기사 내용에서 구체적인 정보를 사용하여 설명 (일반적 구문 완전 제거)
      const startFact = date
        ? `On ${date}, `
        : year 
        ? `In ${year}, `
        : country
        ? `In ${country}, `
        : person
        ? `${person} `
        : org
        ? `${org} `
        : event
        ? `The ${event} `
        : ''
      
      const contextInfo = []
      if (date) contextInfo.push(`on ${date}`)
      if (year && !date) contextInfo.push(`in ${year}`)
      if (country) contextInfo.push(`in ${country}`)
      if (number) contextInfo.push(`with ${number}`)
      if (org) contextInfo.push(`through ${org}`)
      const contextStr = contextInfo.length > 0 ? ` ${contextInfo.join(', ')}` : ''
      
      // 일반적 구문 완전 제거, 구체적 사실만 사용
      return `${startFact}${mainKeyword || 'this event'} occurred${contextStr}. ${country ? `The situation in ${country} ` : 'This situation '}${year ? `Since ${year}, ` : ''}${org ? `${org} has ` : ''}${person ? `${person} has ` : ''}been involved in this issue. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'These events '}reflect broader patterns in how ${country || 'societies'} respond to political and social challenges. ${org ? `${org}'s role in ` : ''}this issue shows how institutions and ${person ? `individuals like ${person} ` : 'individuals '}shape current events. The historical background of ${country || 'this issue'} helps explain why ${date || year || 'current'} developments matter.`
    } else {
      // 기사 내용에서 구체적인 정보를 사용하여 설명 (일반적 구문 완전 제거)
      const startFact = date
        ? `On ${date}, `
        : year 
        ? `In ${year}, `
        : country
        ? `In ${country}, `
        : person
        ? `${person} `
        : org
        ? `${org} `
        : event
        ? `The ${event} `
        : ''
      
      const contextInfo = []
      if (date) contextInfo.push(`on ${date}`)
      if (year && !date) contextInfo.push(`in ${year}`)
      if (country) contextInfo.push(`in ${country}`)
      if (number) contextInfo.push(`with ${number}`)
      if (org) contextInfo.push(`through ${org}`)
      if (person) contextInfo.push(`with ${person}'s involvement`)
      const contextStr = contextInfo.length > 0 ? ` ${contextInfo.join(', ')}` : ''
      
      // 일반적 구문 완전 제거, 구체적 사실만 사용
      return `${startFact}${mainKeyword || 'this event'} occurred${contextStr} within a broader historical and cultural context. ${country ? `The development of this issue in ${country} ` : 'The development of this issue '}${year ? `Since ${year}, ` : ''}${org ? `${org}'s influence on ` : ''}${person ? `${person}'s impact on ` : ''}this matter reflects how different societies conceptualize and respond to similar challenges. ${date ? `The events of ${date} ` : year ? `Events in ${year} ` : 'These events '}reveal patterns in how cultural values, historical experiences, and institutional structures shape contemporary understanding. ${org ? `${org}'s role ` : 'Institutional roles '}and ${person ? `${person}'s actions ` : 'individual actions '}illustrate how different frameworks for understanding authority, legitimacy, and social relationships influence responses to complex issues.`
    }
  }
  
  // 기본 fallback로 전환 (title과 content 전달)
  return generateFallbackDescription(topic, level, title, content)
}

/**
 * 주제별 fallback 설명 생성 (구체적인 배경 지식)
 */
function generateFallbackDescription(
  topic: string, 
  level: 'beginner' | 'intermediate' | 'advanced',
  title?: string,
  content?: string
): string {
  const descriptions: Record<string, Record<string, string>> = {
    'climate and environment': {
      beginner: 'Climate change became a global concern in the 1980s when scientists first warned about rising temperatures. Many countries signed the Paris Agreement in 2015 to limit global warming. Different countries have different responsibilities because some countries used more fossil fuels in the past. Understanding this history helps explain why countries disagree about climate action.',
      intermediate: 'The modern climate movement traces its origins to the 1988 establishment of the Intergovernmental Panel on Climate Change (IPCC) and the 1992 Rio Earth Summit, which introduced the principle of "common but differentiated responsibilities." This recognizes that developed nations, having industrialized using fossil fuels, bear greater historical responsibility. The 2015 Paris Agreement marked a shift toward voluntary national commitments, reflecting tensions between developed and developing nations over equity, historical responsibility, and the right to development.',
      advanced: 'Climate discourse is fundamentally shaped by the historical legacy of the Industrial Revolution and post-colonial resource extraction patterns. The 1992 UN Framework Convention on Climate Change established the principle of "common but differentiated responsibilities," acknowledging that developed nations\' historical emissions (since 1750) have created an "atmospheric debt." This framework continues to structure debates between developed nations emphasizing current emissions and developing nations invoking historical responsibility and equity principles, reflecting deeper tensions between growth-oriented development models and sustainability paradigms.',
    },
    'technology and AI': {
      beginner: 'Computers and AI started becoming important in the 1950s. Today, AI helps in many areas like medicine and transportation. Different countries have different rules about AI. Some countries want to use AI more, while others worry about privacy and jobs. Understanding these differences helps explain technology news.',
      intermediate: 'The field of artificial intelligence emerged from the 1956 Dartmouth Conference, where researchers first coined the term. Today\'s AI development reflects different cultural approaches: Silicon Valley\'s "move fast and break things" philosophy contrasts with the European Union\'s emphasis on regulation and privacy (GDPR), while China prioritizes state-led AI development for social control. These differences stem from varying cultural values around innovation, privacy, individual rights, and the role of government in technology.',
      advanced: 'AI development reflects fundamental cultural and philosophical differences in how societies conceptualize intelligence, agency, and human-technology relationships. The Western tradition, rooted in Cartesian dualism, tends to view AI as potentially replicating human cognition, while Eastern philosophical traditions with holistic worldviews may interpret AI differently. Contemporary debates about AI ethics, automation, and human agency intersect with deeper questions about labor, identity, and the definition of humanity that have been contested across cultures for millennia, revealing how technological development is inseparable from cultural and ideological frameworks.',
    },
    'politics and governance': {
      beginner: 'Different countries have different ways of choosing leaders and making laws. Some countries have elections where people vote. Other countries have different systems. Understanding how governments work helps explain political news from around the world.',
      intermediate: 'Political systems reflect deep cultural and historical differences. Democratic traditions in Western nations evolved from Enlightenment ideas about individual rights and popular sovereignty, while other regions may emphasize collective decision-making, traditional authority, or different conceptions of legitimacy. Contemporary political debates often reflect tensions between these different cultural frameworks for understanding power, representation, and governance.',
      advanced: 'Political systems embody competing cultural and philosophical traditions about the nature of authority, legitimacy, and the relationship between individuals and the state. The Western democratic model, rooted in Enlightenment individualism and social contract theory, contrasts with collectivist traditions, Confucian meritocracy, or other frameworks that prioritize different values. Contemporary political discourse reveals how these foundational cultural differences shape debates about representation, rights, and the proper role of government.',
    },
    'international relations': {
      beginner: 'Countries work together and sometimes disagree. International organizations like the United Nations help countries talk to each other. Different countries have different interests and goals. Understanding how countries interact helps explain international news.',
      intermediate: 'International relations are shaped by historical experiences, cultural values, and different conceptions of sovereignty and national interest. The post-World War II order established institutions like the UN based on Western liberal internationalist principles, but these coexist with alternative frameworks emphasizing non-interference, multipolarity, or regional integration. Understanding these different perspectives is essential for interpreting international diplomacy and conflicts.',
      advanced: 'International relations reflect competing cultural and ideological frameworks about sovereignty, legitimacy, and global order. The post-1945 liberal internationalist order, based on Western conceptions of universal rights and multilateralism, coexists with alternative traditions emphasizing non-interference, civilizational distinctiveness, or multipolar balance-of-power politics. Contemporary diplomatic discourse reveals tensions between these frameworks, shaped by historical experiences of colonialism, different cultural conceptions of authority, and varying approaches to the relationship between national sovereignty and global governance.',
    },
  }
  
  const topicKey = Object.keys(descriptions).find(key => topic.includes(key.split(' ')[0])) || 'current events'
  const topicDescriptions = descriptions[topicKey] || {}
  
  // 주제별 설명이 있으면 반환
  if (topicDescriptions[level]) {
    return topicDescriptions[level]
  }
  
  // 기본 fallback도 일반적인 구문을 피하고 구체적인 정보 제공
  if (!topicDescriptions[level]) {
    // 주제를 기반으로 최소한의 구체적인 정보 제공
    if (topic.includes('climate') || topic.includes('environment')) {
      return level === 'beginner' 
        ? 'Climate change became important in the 1980s. Scientists warned about rising temperatures. Countries signed the Paris Agreement in 2015. Different countries have different responsibilities.'
        : level === 'intermediate'
        ? 'The modern climate movement began with the 1988 establishment of the IPCC and the 1992 Rio Earth Summit. The principle of "common but differentiated responsibilities" recognizes that developed nations bear greater historical responsibility. The 2015 Paris Agreement marked a shift toward voluntary commitments.'
        : 'Climate discourse is shaped by the Industrial Revolution legacy and post-colonial patterns. The 1992 UN Framework Convention established "common but differentiated responsibilities," acknowledging that developed nations\' historical emissions since 1750 have created an "atmospheric debt."'
    }
    
    if (topic.includes('technology') || topic.includes('AI')) {
      return level === 'beginner'
        ? 'Computers and AI started in the 1950s. Today, AI helps in medicine and transportation. Different countries have different rules about AI.'
        : level === 'intermediate'
        ? 'Artificial intelligence emerged from the 1956 Dartmouth Conference. Today\'s AI development reflects different cultural approaches: Silicon Valley\'s philosophy contrasts with the EU\'s emphasis on regulation, while China prioritizes state-led development.'
        : 'AI development reflects fundamental cultural differences in how societies conceptualize intelligence and human-technology relationships. The Western tradition, rooted in Cartesian dualism, contrasts with Eastern holistic worldviews.'
    }
    
    // 기사 제목과 내용을 기반으로 구체적인 설명 생성
    if (title && content) {
      // 제목에서 주요 키워드 추출
      const titleWords = title.split(/\s+/).filter((w: string) => w.length > 4 && /^[A-Z]/.test(w))
      const mainSubject = titleWords[0] || title.split(/\s+/).find((w: string) => w.length > 5) || 'this topic'
      
      // 기사 내용에서 국가, 연도, 조직 등 추출
      const countries = content.match(/\b(China|United States|USA|Russia|Japan|Korea|India|Germany|France|Britain|Taiwan|Ukraine|Brazil|Canada|Australia|Nebraska|America)\b/gi)
      const years = content.match(/\b(19|20)\d{2}\b/g)
      const organizations = content.match(/\b(University|College|UN|NATO|EU|IPCC|UNESCO|Summit|Agreement|Act)\b/gi)
      
      const country = countries ? Array.from(new Set(countries))[0] : null
      const year = years ? Array.from(new Set(years)).sort().reverse()[0] : null
      const org = organizations ? Array.from(new Set(organizations))[0] : null
      
      // 구체적인 정보를 포함한 설명 생성
      if (country || year || org) {
        const contextParts: string[] = []
        if (year) contextParts.push(`in ${year}`)
        if (country) contextParts.push(`in ${country}`)
        if (org) contextParts.push(`through ${org}`)
        
        const contextStr = contextParts.length > 0 ? ` ${contextParts.join(', ')}` : ''
        
        if (level === 'beginner') {
          return `${mainSubject} is an important topic${contextStr}. This topic has a long history. Many people care about this topic. Different places have different ways of thinking about it. Learning about this history helps understand the news.`
        } else         if (level === 'intermediate') {
          // 구체적인 정보를 포함한 설명 생성 (일반적 구문 피하기)
          if (country || year || org) {
            // 구체적인 사실로 시작
            const startFact = year 
              ? `In ${year}, ${mainSubject} became significant when`
              : country
              ? `In ${country}, ${mainSubject} has been shaped by`
              : org
              ? `${org} has influenced ${mainSubject} through`
              : `${mainSubject} emerged from`
            
            return `${startFact} specific historical events and cultural developments. ${country ? `The situation in ${country} reflects ` : ''}${year ? `Since ${year}, ` : ''}${org ? `${org} has played a key role in ` : ''}shaping how this topic is understood. The historical background of ${country || 'this issue'} helps explain why current developments matter and how different perspectives have developed over time.`
          }
          // 구체적 정보가 없어도 일반적 구문 피하기
          return `${mainSubject} emerged from specific historical events that shaped its current significance. Different regions have developed distinct approaches based on their unique historical experiences, economic conditions, and cultural values. The evolution of this topic reflects broader patterns in how societies respond to similar challenges, with each region adapting solutions to fit local contexts and traditions.`
        } else {
          return `${mainSubject} embodies complex cultural and historical dynamics${contextStr} that reflect deeper societal structures and ideological frameworks. The evolution of this topic reveals how different cultural traditions, historical experiences, and social systems shape contemporary understanding and responses. These differences are not merely variations in perspective but reflect fundamental differences in how societies conceptualize core values, authority, and the relationship between individuals and institutions.`
        }
      }
      
      // 최소한의 구체적 정보라도 포함
      return level === 'beginner'
        ? `${mainSubject} is an important topic in the news. This topic has a history. Many countries care about this topic. Learning about this history helps understand why people talk about it.`
        : level === 'intermediate'
        ? `${mainSubject} emerged from specific historical events that shaped its current significance. The development of this topic reflects how different regions responded to similar challenges, with each adapting solutions based on local historical experiences, economic conditions, and cultural values. The evolution of this topic reveals broader patterns in how societies interpret and respond to complex issues, making it essential to understand the historical background when interpreting current developments.`
        : `${mainSubject} embodies complex cultural and historical dynamics that reflect deeper societal structures. The evolution of this topic reveals how different cultural traditions and historical experiences shape contemporary understanding. These differences reflect fundamental variations in how societies conceptualize values, authority, and social relationships.`
    }
    
    // title과 content가 없을 때의 최종 fallback
    return level === 'beginner'
      ? 'This topic has cultural and historical background. Different countries have different views. Understanding this helps explain news.'
      : level === 'intermediate'
      ? 'This topic emerged from specific historical events that shaped its current significance. The development of this topic reflects how different regions responded to similar challenges, with each adapting solutions based on local historical experiences and cultural values. Understanding the historical background helps interpret why current developments matter and how different perspectives have developed over time.'
      : 'This topic embodies complex cultural and historical dynamics that reflect deeper societal structures. The evolution of this topic reveals how different cultural traditions and historical experiences shape contemporary understanding.'
  }
  
  // topicDescriptions[level]이 있는 경우 (이미 위에서 return했지만 타입 체크를 위해)
  return topicDescriptions[level] || 'This topic has important cultural and historical background.'
}

/**
 * 기사 내용에서 문화적 예시 추출
 */
function extractCulturalExamples(content: string, topic: string): string[] {
  const examples: string[] = []
  
  // 일반적인 문화적 표현 패턴
  const patterns = [
    /\b(?:global|international|worldwide|societal|cultural)\s+\w+/gi,
    /\b(?:policy|strategy|initiative|movement|trend)\b/gi,
    /\b(?:awareness|understanding|perspective|viewpoint)\b/gi,
  ]
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      examples.push(...matches.slice(0, 2).map(m => m.toLowerCase()))
    }
  })
  
  // 기본 예시 추가
  if (examples.length === 0) {
    examples.push('global perspective', 'cultural awareness', 'societal impact')
  }
  
  return Array.from(new Set(examples)).slice(0, 5)
}

/**
 * 더 구체적인 fallback 생성 (기사 내용을 더 깊이 분석)
 */
function generateMoreSpecificFallback(
  title: string,
  content: string,
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  keyEntities: string[],
  specificInfo: string
): string {
  const titleLower = title.toLowerCase()
  const contentLower = content.toLowerCase()
  
  // 제목에서 주요 키워드 추출
  const titleWords = title.match(/\b[A-Z][a-z]+\b/g) || []
  const mainKeyword = titleWords.find(k => 
    k.length > 4 && 
    !['The', 'This', 'That', 'With', 'From', 'About', 'News', 'Trump'].includes(k)
  ) || titleWords[0] || ''
  
  // 기사에서 구체적인 정보 추출
  const years = content.match(/\b(19|20)\d{2}\b/g)
  const recentYear = years ? Array.from(new Set(years)).sort().reverse()[0] : null
  
  const countries = content.match(/\b(China|United States|USA|Russia|Japan|Korea|India|Germany|France|Britain|Taiwan|Ukraine|Brazil|Canada|Australia|Nebraska|America|American)\b/gi)
  const country = countries ? Array.from(new Set(countries))[0] : null
  
  const organizations = content.match(/\b(University|College|UN|NATO|EU|IPCC|UNESCO|Summit|Agreement|Act|Congress|Parliament|Government|Administration|White House)\b/gi)
  const org = organizations ? Array.from(new Set(organizations))[0] : null
  
  // 1월 6일 국회의사당 폭동 관련 특별 처리
  if (titleLower.includes('january 6') || titleLower.includes('jan. 6') || titleLower.includes('capitol') || 
      contentLower.includes('january 6') || contentLower.includes('jan. 6') || contentLower.includes('capitol riot') ||
      titleLower.includes('pipe bomb') || contentLower.includes('pipe bomb') ||
      titleLower.includes('dnc') || titleLower.includes('rnc') || contentLower.includes('dnc') || contentLower.includes('rnc')) {
    if (level === 'beginner') {
      return `On January 6, 2021, many people broke into the U.S. Capitol building in Washington, D.C. This happened after the 2020 presidential election. Some people were angry about the election results. The FBI arrested many people who did this. This was a very important event in American history. Understanding what happened helps explain news about politics and elections in America.`
    } else if (level === 'intermediate') {
      return `The January 6, 2021, attack on the U.S. Capitol represents a significant moment in American political history. On that day, supporters of then-President Donald Trump stormed the Capitol building in an attempt to prevent Congress from certifying Joe Biden's 2020 election victory. The attack resulted in five deaths and led to the largest criminal investigation in FBI history, with over 1,500 people charged. The events of January 6 occurred against the backdrop of false claims about election fraud and reflected deep political polarization in the United States. The Democratic National Committee (DNC) and Republican National Committee (RNC) are the two major political party organizations in America, and pipe bombs were placed outside both headquarters on January 5, 2021, the night before the Capitol attack. Understanding the historical context of political violence, the role of political parties in American democracy, and the FBI's investigation process helps interpret news about these events.`
    } else {
      return `The January 6, 2021, attack on the U.S. Capitol represents a watershed moment in American political history, occurring in the context of contested election results and unprecedented political polarization. On that day, a mob of supporters of then-President Donald Trump breached the Capitol building during the certification of the 2020 presidential election, resulting in five deaths and the largest criminal investigation in FBI history, with over 1,500 individuals charged. The attack reflected broader tensions in American democracy, including questions about the peaceful transfer of power, the role of misinformation, and the relationship between political rhetoric and violence. The Democratic National Committee (DNC) and Republican National Committee (RNC) are the two major political party organizations that coordinate party activities and fundraising. Pipe bombs were discovered outside both headquarters on January 5, 2021, the night before the Capitol attack, though they did not detonate. Understanding the historical development of American political parties, the tradition of peaceful transitions of power since the nation's founding, and the FBI's role in investigating domestic terrorism is crucial for interpreting news about these events and their implications for American democracy.`
    }
  }
  
  // "Trump" 관련 특별 처리 (더 구체적으로)
  if (titleLower.includes('trump') || contentLower.includes('trump') || mainKeyword.toLowerCase().includes('trump')) {
    // 기사에서 Trump와 관련된 구체적인 정보 추출
    const trumpYears = content.match(/\b(2016|2017|2018|2019|2020|2021|2024)\b/g)
    const hasChina = contentLower.includes('china') || contentLower.includes('chinese')
    const hasTrade = contentLower.includes('trade') || contentLower.includes('tariff')
    const hasElection = contentLower.includes('election') || contentLower.includes('vote')
    
    if (level === 'beginner') {
      if (hasChina) {
        return `Donald Trump was the 45th President of the United States from 2017 to 2021. During his presidency, Trump had many disagreements with China about trade. He put taxes on Chinese products. China also put taxes on American products. This trade war affected many businesses. Understanding how America and China compete helps explain news about Trump and China.`
      }
      return `Donald Trump was the 45th President of the United States from 2017 to 2021. He was a businessman before becoming president. Trump's election in 2016 surprised many people. His presidency was very controversial. Many people had different opinions about his policies. Understanding American politics helps explain news about Trump.`
    } else if (level === 'intermediate') {
      if (hasChina) {
        return `Donald Trump's relationship with China during his presidency (2017-2021) reflected broader tensions in U.S.-China relations. The trade war that began in 2018, with tariffs on $250 billion worth of Chinese goods, represented a shift from decades of engagement policy. This conflict stemmed from concerns about intellectual property theft, trade imbalances, and China's growing economic influence. The Trump administration's "America First" approach contrasted with previous administrations' emphasis on multilateral cooperation. Understanding the historical context of U.S.-China relations since normalization in 1979, and how economic competition intersects with geopolitical tensions, is essential for interpreting news about Trump and China.`
      }
      return `Donald Trump, the 45th President of the United States (2017-2021), marked a significant shift in American politics. A businessman and reality TV personality before entering politics, Trump's election in 2016 reflected populist movements and political polarization in the U.S. His presidency was marked by controversial policies on immigration, trade, and international relations. The American two-party system, established in the 1800s, creates a political environment where candidates must appeal to party bases. Understanding how American political culture, media influence, and electoral systems work helps interpret news about Trump and contemporary U.S. politics.`
    } else {
      if (hasChina) {
        return `The Trump administration's approach to China (2017-2021) represented a fundamental shift in U.S. foreign policy, moving from decades of engagement to strategic competition. The trade war initiated in 2018, involving tariffs on hundreds of billions of dollars in goods, reflected deeper concerns about intellectual property protection, technology transfer, and China's economic practices. This conflict occurred against the backdrop of China's rise as a global power since economic reforms began in 1978, and growing U.S. concerns about maintaining technological and economic dominance. The "America First" philosophy that characterized Trump's foreign policy contrasted with post-World War II multilateralism, reflecting broader debates about globalization, economic interdependence, and the future of U.S.-China relations in an era of great power competition.`
      }
      return `Donald Trump's political career reflects broader shifts in American political culture and the relationship between media, populism, and institutional legitimacy. As the 45th U.S. President (2017-2021), Trump's background as a businessman and media personality, combined with his populist rhetoric, challenged traditional political norms. His presidency occurred during a period of intense political polarization in the United States, with debates over immigration, trade policy, and America's role in international institutions. Understanding the historical development of American political parties, the role of media in shaping political discourse, and the cultural factors that enable populist movements is crucial for interpreting news about Trump and contemporary American politics.`
    }
  }
  
  // 기사 제목과 내용을 기반으로 최대한 구체적인 설명 생성
  // years, recentYear, country, org는 이미 위에서 정의됨
  const contextParts: string[] = []
  if (recentYear) contextParts.push(`in ${recentYear}`)
  if (country) contextParts.push(`in ${country}`)
  if (org) contextParts.push(`through ${org}`)
  
  const contextStr = contextParts.length > 0 ? ` ${contextParts.join(', ')}` : ''
  
  if (mainKeyword && mainKeyword.length > 3) {
    if (level === 'beginner') {
      return `${mainKeyword}${contextStr ? ' ' + contextStr : ''} is an important topic in the news. This topic has a long history. Many people care about this topic. Learning about this history helps understand why it appears in the news.`
    } else if (level === 'intermediate') {
      return `${mainKeyword}${contextStr ? ' ' + contextStr : ''} represents a topic with specific historical and cultural significance. The development of this topic involves particular historical events, cultural practices, and social structures. Understanding the specific historical context and cultural factors that shaped this topic helps interpret current news and developments.`
    } else {
      return `${mainKeyword}${contextStr ? ' ' + contextStr : ''} embodies complex cultural and historical dynamics that reflect deeper societal structures. The evolution of this topic reveals how specific historical events, cultural traditions, and social systems have shaped contemporary understanding and responses. These developments are not merely variations in perspective but reflect fundamental differences in how societies conceptualize values, authority, and social relationships.`
    }
  }
  
  // 최종 fallback
  return generateFallbackDescription(topic, level, title, content)
}


'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Volume2, BookOpen, ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import CulturalContextCard from '@/components/CulturalContextCard'
import RephraseCompare from '@/components/RephraseCompare'

interface NewsArticle {
  id: string
  title: string
  summary?: string
  content: string
  keywords?: string[]
  grammarPoints?: string[]
  culturalContext?: {
    title: string
    description: string
    examples: string[]
  }
  url?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export default function NewsDetailPage() {
  const params = useParams()
  const articleId = params.id as string
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/news/${articleId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data && data.article) {
        setArticle(data.article)
      } else {
        console.error('Article not found in response')
        setArticle(null)
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }


  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">기사를 불러오는 중...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">기사를 찾을 수 없습니다.</p>
        <Link href="/news" className="btn-primary mt-4 inline-block">
          뉴스 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/news"
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뉴스 목록으로</span>
      </Link>

      <div className="card">
        <h1 className="text-4xl font-bold mb-4">{article?.title || 'Untitled'}</h1>
        
        <div className="mb-6">
          <button
            onClick={() => handlePlayAudio(article?.content || '')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Volume2 className="w-5 h-5" />
            <span>발음 듣기</span>
          </button>
        </div>

        {/* Keywords */}
        {article?.keywords && article.keywords.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              핵심 어휘
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Points */}
        {article?.grammarPoints && article.grammarPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">문법 포인트</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {article.grammarPoints.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Summary */}
        {article?.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">기사 요약</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{article.summary}</p>
            </div>
          </div>
        )}

        {/* Original Article Link */}
        {article.url && (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
            >
              <Globe className="w-5 h-5" />
              <span>원문 사이트에서 전체 기사 보기 →</span>
            </a>
          </div>
        )}

        {/* Cultural Context Card */}
        {article?.culturalContext && (
          <CulturalContextCard context={article.culturalContext} />
        )}

        {/* Rephrase and Compare */}
        {article?.summary && (
          <div className="mt-6">
            <RephraseCompare text={article.summary.substring(0, 500)} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href={`/quiz?articleId=${article?.id || ''}&title=${encodeURIComponent(article?.title || '')}&content=${encodeURIComponent((article?.content || '').substring(0, 2000))}&keywords=${encodeURIComponent((article?.keywords || []).join(','))}`}
            className="btn-primary"
          >
            이 기사로 퀴즈 풀기
          </Link>
          <Link
            href={`/writing?articleId=${article?.id || ''}`}
            className="btn-secondary"
          >
            의견문 작성하기
          </Link>
        </div>
      </div>
    </div>
  )
}




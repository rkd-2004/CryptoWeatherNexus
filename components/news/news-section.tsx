"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNewsData } from "@/redux/features/newsSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

export default function NewsSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { articles, status, error } = useSelector((state: RootState) => state.news)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNewsData())
    }

    // Refresh data every 10 minutes
    const interval = setInterval(() => {
      dispatch(fetchNewsData())
    }, 600000)

    return () => clearInterval(interval)
  }, [dispatch, status])

  const loading = status === "loading" && articles.length === 0
  const failed = status === "failed"

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Crypto News</CardTitle>
        <CardDescription>Latest cryptocurrency headlines</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 py-4 first:pt-0 last:pb-0 border-b last:border-0">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-3 pt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : failed ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-destructive">Failed to load news</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-4">
            {articles.slice(0, 5).map((article, index) => (
              <div key={index} className="space-y-2 py-4 first:pt-0 last:pb-0 border-b last:border-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-medium hover:underline"
                >
                  {article.title}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                <div className="flex items-center gap-3 pt-1">
                  <p className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</p>
                  {article.source && (
                    <Badge variant="outline" className="text-xs px-2">
                      {article.source}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No news articles available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


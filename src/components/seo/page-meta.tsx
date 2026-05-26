import { useEffect } from "react"
import { Helmet } from "react-helmet-async"

type PageMetaProps = {
  title: string
  description: string
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title

    const descriptionTag = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    )

    if (descriptionTag) {
      descriptionTag.content = description
      return
    }

    const meta = document.createElement("meta")
    meta.name = "description"
    meta.content = description
    document.head.append(meta)
  }, [description, title])

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}


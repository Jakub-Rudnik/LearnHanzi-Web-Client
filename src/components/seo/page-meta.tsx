import { Helmet } from "react-helmet-async"

type PageMetaProps = {
  title: string
  description: string
}

export default function PageMeta({ title, description }: PageMetaProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}


import LabChrome from './LabChrome'
import { posts, getPost } from '../content/devBlog'

export default function DevBlogPage({ slug }) {
  const post = slug ? getPost(slug) : null

  if (slug && !post) {
    return (
      <LabChrome active="blog">
        <header className="lab-hero">
          <p className="v2-specimen">BLOG · 404</p>
          <h1>Post not found.</h1>
          <p className="lab-lede">That post is missing. It may have been renamed or never published.</p>
          <p className="lab-updated"><a href="/blog">← All posts</a></p>
        </header>
      </LabChrome>
    )
  }

  if (post) {
    return (
      <LabChrome active="blog">
        <article className="lab-post">
          <header className="lab-hero">
            <p className="v2-specimen">BLOG · {formatDate(post.date)}</p>
            <h1>{post.title}</h1>
            <p className="lab-lede">{post.summary}</p>
            <div className="lab-tags">
              {post.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </header>
          <div className="lab-post-body">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <footer className="lab-post-foot">
            <a href="/blog">← All posts</a>
            <a href="/roadmap">View roadmap →</a>
          </footer>
        </article>
      </LabChrome>
    )
  }

  return (
    <LabChrome active="blog">
      <header className="lab-hero">
        <p className="v2-specimen">BLOG</p>
        <h1>Dev blog.<br /><em>What we are building.</em></h1>
        <p className="lab-lede">
          Short posts on what we shipped, what broke, and what changed.
        </p>
      </header>

      <section className="v2-section lab-blog-list">
        <ul className="lab-post-index">
          {posts.map((p) => (
            <li key={p.slug}>
              <a href={`/blog/${p.slug}`}>
                <div>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <div className="lab-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <h2>{p.title}</h2>
                <p>{p.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </LabChrome>
  )
}

function formatDate(iso) {
  const d = new Date(`${iso}T12:00:00Z`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
}

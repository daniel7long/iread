import type { Book } from '@/types'

export function BookCover({ book, size = 'md', showTitle = true }: { book: Book; size?: 'sm' | 'md' | 'lg'; showTitle?: boolean }) {
  return (
    <div
      className={`cover cover-${size}`}
      role="img"
      aria-label={`Cover of ${book.title}`}
      style={{ background: `linear-gradient(155deg, ${book.cover.from}, ${book.cover.to})` }}
    >
      <span className="cover-icon" aria-hidden="true">{book.cover.icon}</span>
      {showTitle && (
        <span className="cover-title">
          {book.title.replace(/^The /, '')}
          <em>Level {book.level}</em>
        </span>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

function NotFoundPage() {
  return (
    <PageHero
      eyebrow="404"
      title="Page Not Found"
      subtitle="The page you are looking for does not exist."
      actions={
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      }
    />
  )
}

export default NotFoundPage

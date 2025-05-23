import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { Link, useParams } from 'react-router-dom';
import { request, gql } from 'graphql-request';

const endpoint = import.meta.env.VITE_API_URL;

const CATEGORY_QUERY = gql`
  {
    categories {
      name
    }
  }
`;

interface Category {
  name: string;
}

function CategoryNav(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const { categoryName } = useParams();

  useEffect(() => {
    request<{ categories: Category[] }>(endpoint, CATEGORY_QUERY)
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error('Error loading categories:', err));
  }, []);

  return (
    <nav style={{ padding: '1rem' }}>
      {categories.map((category) => {
        const isActive = category.name === categoryName;
        return (
          <Link
            key={category.name}
            to={`/${category.name}`}
            data-testid={isActive ? 'active-category-link' : 'category-link'}
            style={{
              marginRight: '1rem',
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </Link>
        );
      })}
    </nav>
  );
}

export default CategoryNav;
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { request, gql } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

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

const Layout = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    request<{ categories: Category[] }>(endpoint, CATEGORY_QUERY)
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to="/" style={{ marginRight: '1rem' }}>All</NavLink>
        {categories.map((category) => (
          <NavLink
            key={category.name}
            to={`/category/${category.name.toLowerCase()}`}
            style={{ marginRight: '1rem' }}
          >
            {category.name}
          </NavLink>
        ))}
      </nav>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
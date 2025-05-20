import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

const QUERY = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      sku
      brand
      gallery
      in_stock
      description
      price
    }
  }
`;

type Product = {
  id: string;
  name?: string;
  sku?: string;
  brand?: string;
  gallery?: string[];
  in_stock?: boolean;
  description?: string;
  price?: number;
};

type ProductQueryResult = {
  products: Product[];
};

export default function ProductListPage() {
  const { category = 'all' } = useParams();

  const { data, isLoading, error } = useQuery<ProductQueryResult>({
    queryKey: ['categoryProducts', category],
    queryFn: async (): Promise<ProductQueryResult> => {
      const res = await request<ProductQueryResult>('http://localhost:4000/graphql', QUERY, {
        category: category === 'all' ? undefined : category,
      });

      if (!res || !res.products) {
        return { products: [] };
      }

      return res;
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return (
    <div className="p-8 text-red-600">
      Error loading products:<br />
      <pre>{error.message}</pre>
    </div>
  );

  const products = data?.products ?? [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold capitalize mb-4">{category}</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const isInStock = product.in_stock ?? true;

            return (
              <div
                key={product.id}
                className={`relative border p-4 rounded shadow transition ${
                  !isInStock ? 'opacity-60' : ''
                }`}
              >
                <Link to={`/${category}/${product.sku ?? product.id}`}>
                  <div className="relative mb-2">
                    <img
                      src={product.gallery?.[0] ?? 'https://via.placeholder.com/200'}
                      alt={product.name ?? 'Product'}
                      className="w-full h-48 object-cover"
                    />
                    {!isInStock && (
                      <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-1">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>
                  <h2 className="font-medium">{product.name ?? 'Unnamed Product'}</h2>
                  <p className="text-gray-600">
                    ${product.price?.toFixed(2) ?? '?.??'}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useCart } from '../context/CartContext';

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
      attributes {
        id
        name
        type
        items {
          id
          value
          displayValue
        }
      }
    }
  }
`;

type Product = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  gallery: string[];
  in_stock: boolean;
  description: string;
  price: number;
  attributes: {
    id: string;
    name: string;
    type: string;
    items: {
      id: string;
      value: string;
      displayValue: string;
    }[];
  }[];
};

export default function ProductListPage() {
  const { category = 'all' } = useParams();
  const { dispatch } = useCart();

  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['categoryProducts', category],
    queryFn: async () => {
      const res = await request<{ products: Product[] }>(import.meta.env.VITE_API_URL, QUERY, {
        category: category === 'all' ? undefined : category,
      });
      return res;
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) {
    return (
      <div className="p-8 text-red-600">
        Error loading products:<br />
        <pre>{(error as Error).message}</pre>
      </div>
    );
  }

  const handleQuickShop = (product: Product) => {
    const defaultAttributes: { [key: string]: string } = {};
    product.attributes.forEach(attr => {
      defaultAttributes[attr.id] = attr.items[0].id;
    });

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        gallery: product.gallery,
        quantity: 1,
        selectedAttributes: defaultAttributes,
        attributes: product.attributes,
      },
    });
  };

  return (
    <div className="py-10">
      <h1 className="text-4xl font-semibold capitalize mb-4">{category}</h1>
      {data?.products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {data?.products.map((product) => {
            const isInStock = product.in_stock;

            return (
              <div
                key={product.id}
                data-testid={`product-${product.sku}`}
                className="relative p-4 group transition duration-200 hover:shadow-lg"
              >
                <Link to={`/${category}/${product.sku}`} className="block relative">
                  <div className="relative mb-2">
                    <img
                      src={product.gallery[0]}
                      alt={product.name}
                      className={`w-full aspect-square object-cover transition ${
                        !isInStock ? 'grayscale opacity-60' : ''
                      }`}
                    />
                    {!isInStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-500 tracking-wide">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-gray-600">{product.name}</h2>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </Link>

                {isInStock && (
                  <button
                    onClick={() => handleQuickShop(product)}
                    className="absolute bottom-4 right-4 bg-green-500 text-white rounded-full p-2 hidden group-hover:block"
                  >
                    🛒
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
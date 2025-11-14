import { toast } from "sonner";

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "carplay-connect-flow-ngc9h.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "f289ece3ecfbc6b81d8a963179af6567";

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyGraphQLResponse<T> = {
  data: T;
  errors?: ShopifyGraphQLError[];
};

type ShopifyVariables = Record<string, unknown>;

interface CartLineItem {
  quantity: number;
  variantId: string;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function storefrontApiRequest<T>(query: string, variables: ShopifyVariables = {}): Promise<T> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan. Your store needs to be upgraded to a paid plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(`Error calling Shopify: ${payload.errors.map((e) => e.message).join(", ")}`);
  }

  return payload.data;
}

export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  type ProductsResponse = {
    products: {
      edges: ShopifyProduct[];
    };
  };

  const data = await storefrontApiRequest<ProductsResponse>(STOREFRONT_QUERY, { first });
  return data.products.edges;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  type ProductByHandleResponse = {
    productByHandle: ShopifyProduct['node'] | null;
  };

  const data = await storefrontApiRequest<ProductByHandleResponse>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.productByHandle;
}

export async function createStorefrontCheckout(items: CartLineItem[]): Promise<string> {
  try {
    const lines = items.map((item) => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    type CartCreateResponse = {
      cartCreate: {
        cart: {
          checkoutUrl: string | null;
        } | null;
        userErrors: ShopifyGraphQLError[];
      };
    };

    const cartData = await storefrontApiRequest<CartCreateResponse>(CART_CREATE_MUTATION, {
      input: {
        lines,
      },
    });

    if (cartData.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.cartCreate.userErrors.map((e) => e.message).join(", ")}`);
    }

    const cart = cartData.cartCreate.cart;
    
    if (!cart.checkoutUrl) {
      throw new Error("No checkout URL returned from Shopify");
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set("channel", "online_store");
    const checkoutUrl = url.toString();
    return checkoutUrl;
  } catch (error) {
    console.error("Error creating storefront checkout:", error);
    throw error;
  }
}

export { storefrontApiRequest };

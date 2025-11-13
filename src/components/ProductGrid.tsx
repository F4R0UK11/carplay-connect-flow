import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(20),
  });

  if (isLoading) {
    return (
      <section id="products" className="py-20">
        <div className="container">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-20">
        <div className="container">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Failed to load products. Please try again.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section id="products" className="py-20">
        <div className="container">
          <div className="text-center py-20 space-y-4">
            <h2 className="text-2xl font-bold">No products found</h2>
            <p className="text-muted-foreground">
              Check back soon for our CarPlay accessories!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20">
      <div className="container">
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Shop CarPlay Accessories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium wireless adapters, screens, and accessories for your car
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

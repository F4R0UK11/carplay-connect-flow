import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductByHandle } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Loader2, ChevronLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export default function Product() {
  const { handle } = useParams<{ handle: string }>();
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const addItem = useCartStore(state => state.addItem);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => getProductByHandle(handle!),
    enabled: !!handle,
  });

  const handleAddToCart = () => {
    if (!product) return;

    const variant = product.variants.edges.find(v => v.node.id === selectedVariantId)?.node 
      || product.variants.edges[0]?.node;

    if (!variant) {
      toast.error("Product not available");
      return;
    }

    const cartItem = {
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: product.title,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Button asChild>
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>

            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.edges.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                      src={image.node.url}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
              <p className="text-3xl font-bold text-accent">
                {product.priceRange.minVariantPrice.currencyCode} {price.toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.name} className="space-y-2">
                    <label className="text-sm font-medium">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const variant = product.variants.edges.find(v => 
                          v.node.selectedOptions.some(opt => opt.value === value)
                        );
                        return (
                          <Button
                            key={value}
                            variant={selectedVariantId === variant?.node.id ? "default" : "outline"}
                            onClick={() => setSelectedVariantId(variant?.node.id || "")}
                            className="min-w-[80px]"
                          >
                            {value}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              size="lg"
              className="w-full text-base"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                <div>
                  <h4 className="font-medium">2-Year Warranty</h4>
                  <p className="text-sm text-muted-foreground">Full coverage on all products</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                <div>
                  <h4 className="font-medium">30-Day Returns</h4>
                  <p className="text-sm text-muted-foreground">Easy returns and exchanges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

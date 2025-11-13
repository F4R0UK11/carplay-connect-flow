import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = node.variants.edges[0]?.node;
    if (!firstVariant) {
      toast.error("Product not available");
      return;
    }

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: node.title,
    });
  };

  const imageUrl = node.images.edges[0]?.node.url;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  return (
    <Link 
      to={`/product/${node.handle}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-[var(--shadow-glow)]">
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={node.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-accent transition-colors">
              {node.title}
            </h3>
            {node.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {node.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl font-bold">
              {node.priceRange.minVariantPrice.currencyCode} {price.toFixed(2)}
            </span>

            <Button
              size="sm"
              onClick={handleAddToCart}
              className="shrink-0"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

-- Index foreign-key columns used while loading carts, wishlists, and orders.
create index if not exists cart_items_product_id_idx
  on public.cart_items (product_id);

create index if not exists wishlist_items_product_id_idx
  on public.wishlist_items (product_id);

create index if not exists order_items_product_id_idx
  on public.order_items (product_id);

-- This event-trigger helper is internal database infrastructure. It does not
-- need to be callable through the public API roles.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

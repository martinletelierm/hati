-- Desglose preventa por pedido (recomendado para cupo diario Pre Venta 1).
alter table public.preorders add column if not exists unidades_preventa_1 integer not null default 0;
alter table public.preorders add column if not exists unidades_preventa_2 integer not null default 0;

comment on column public.preorders.unidades_preventa_1 is 'Unidades del pedido a precio Pre Venta 1';
comment on column public.preorders.unidades_preventa_2 is 'Unidades del pedido a precio Pre Venta 2';

-- Function to help to get statistics
CREATE OR REPLACE FUNCTION public.get_statistics()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    best_sold_product JSON;
    best_customer JSON;
    hourly_data JSON;
    daily_sales JSON;
    daily_growth JSON;
    combined_data JSON;
BEGIN
   SELECT
    json_build_object('id', p.id, 'name', p.name, 'quantity_sold', o.sale_quantity) INTO best_sold_product
FROM (
    SELECT
        product_id,
        sum(quantity) as sale_quantity
    FROM order_items
    GROUP BY product_id
) o
JOIN products p ON o.product_id = p.id
ORDER BY sale_quantity DESC limit 1;

   SELECT
    json_build_object('id', c.id, 'name', c.name, 'total_spend', o.total_spend) INTO best_customer
FROM (
    SELECT
        customer_id,
        sum(total_amount) as total_spend
    FROM orders
    GROUP BY customer_id
) o
JOIN customers c ON o.customer_id = c.id
ORDER BY total_spend DESC limit 1;
    
    SELECT
        json_agg(q) INTO hourly_data
    FROM (
        SELECT
            hour,
            sum(total_amount) as total_amount
        FROM (
            SELECT
                created_at::date as day,
                extract(hour from created_at) as hour,
                total_amount
            FROM orders
            WHERE created_at BETWEEN date_trunc('day', now()) AND date_trunc('day', now()) + interval '1 day'
        ) as daily_orders
        GROUP BY hour
        ORDER BY hour
    ) q;
    
    SELECT
        json_agg(q) INTO daily_sales
    FROM (
        SELECT
            created_at::date as day,
            sum(total_amount) as sale_value
        FROM orders
        WHERE created_at BETWEEN date_trunc('day', now() - interval '7 day') AND date_trunc('day', now()) + interval '1 day'
        GROUP BY day
        ORDER BY day
    ) q;
    
    SELECT
        json_agg(q) INTO daily_growth
    FROM (
        SELECT
            day,
            sale_value,
            lag(sale_value) over (ORDER BY day) as last_day_sale_value,
            (sale_value - lag(sale_value) over (ORDER BY day)) / lag(sale_value) over (ORDER BY day) as ratio
        FROM (
            SELECT
                created_at::date as day,
                sum(total_amount) as sale_value
            FROM orders
            WHERE created_at BETWEEN date_trunc('day', now() - interval '7 day') AND date_trunc('day', now()) + interval '1 day'
            GROUP BY day
            ORDER BY day
        ) as daily_sales
    ) q;
    
    combined_data := json_build_object(
        'best_sold_product', best_sold_product,
        'best_customer', best_customer,
        'hourly_data', hourly_data,
        'daily_sales', daily_sales,
        'daily_growth', daily_growth
    );
    
    RETURN combined_data;
END;
$function$

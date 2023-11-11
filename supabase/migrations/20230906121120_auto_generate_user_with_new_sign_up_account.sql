-- Function to create user on signup
CREATE OR REPLACE FUNCTION public.create_user_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into public.users (id, email, full_name, phone)
    values (new.id, new.email, 'full_name', coalesce(new.phone, ''));
    return new;
end;
$function$;


-- trigger to create user after insert into auth.users
create trigger create_user_on_signup
    after insert
    on auth.users
    for each row
execute procedure public.create_user_on_signup();

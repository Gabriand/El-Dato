import { supabase } from "./supabaseClient";

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
    if (error) throw error;
    return data;
}

export async function getMarkets(city) {
    const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('city', city)
        .order('name');
    if (error) throw error;
    return data;
}

export async function getRecentReports(city) {
    const { data, error } = await supabase
        .from('price_reports')
        .select(`
            id, price, quantity, created_at, user_id,
            products (id, name, unit, image_url),
            markets!inner (id, name, city)
        `)
        .eq('markets.city', city)
        .order('created_at', { ascending: false })
        .limit(15);
        
    if (error) throw error;
    return data;
}

export async function submitReport(reportData) {
    const { data, error } = await supabase
        .from('price_reports')
        .insert([reportData])
        .select();
    if (error) throw error;
    return data;
}

export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getProductById(id, city) {
    const { data: product, error: pError } = await supabase.from('products').select('*').eq('id', id).single();
    if (pError) throw pError;

    const { data: reports, error: rError } = await supabase.from('price_reports')
        .select(`
            id, price, quantity, created_at, user_id,
            markets!inner (id, name, city)
        `)
        .eq('product_id', id)
        .eq('markets.city', city)
        .order('created_at', { ascending: false });
    
    if (rError) throw rError;

    return { product, reports: reports || [] };
}

export async function getMarketById(id) {
    const { data: market, error: mError } = await supabase.from('markets').select('*').eq('id', id).single();
    if (mError) throw mError;

    const { data: reports, error: rError } = await supabase.from('price_reports')
        .select(`
            id, price, quantity, created_at, user_id,
            products(id, name, unit)
        `)
        .eq('market_id', id)
        .order('created_at', { ascending: false });
    
    if (rError) throw rError;

    return { market, reports: reports || [] };
}

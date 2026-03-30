import { supabase } from "./supabaseClient";
import { getCityAliases, normalizeCityCode } from "../utils/city";

async function queryRecentReports({
    cityAliases,
    includeCategoryJoin,
    withCityFilter,
}) {
    const baseSelect = includeCategoryJoin
        ? `
            id, price, created_at, user_id,
            products!inner (id, name, unit, image_url, category_id, categories(id, name)),
            markets!inner (id, name, city)
        `
        : `
            id, price, created_at, user_id,
            products!inner (id, name, unit, image_url, category_id),
            markets!inner (id, name, city)
        `;

    let query = supabase
        .from("price_reports")
        .select(baseSelect)
        .order("created_at", { ascending: false })
        .limit(120);

    if (withCityFilter) {
        query = query.in("markets.city", cityAliases);
    }

    return query;
}

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
    if (error) throw error;
    return data;
}

export async function getMarkets(city) {
    const cityCode = normalizeCityCode(city);
    const cityAliases = getCityAliases(cityCode);

    const { data, error } = await supabase
        .from("markets")
        .select("*")
        .in("city", cityAliases)
        .order("name");
    if (error) throw error;

    // Fallback seguro: si no hay mercados para la ciudad, mostrar catálogo general
    if (!data || data.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
            .from("markets")
            .select("*")
            .order("name");

        if (fallbackError) throw fallbackError;
        return fallbackData;
    }

    return data;
}

export async function getRecentReports(city) {
    const cityCode = normalizeCityCode(city);
    const cityAliases = getCityAliases(cityCode);

    // Intento 1: consulta completa con categoría embebida
    let { data, error } = await queryRecentReports({
        cityAliases,
        includeCategoryJoin: true,
        withCityFilter: true,
    });

    // Intento 2: si falla join de categorías (RLS/permiso), degradar a consulta simple
    if (error) {
        const simpleQuery = await queryRecentReports({
            cityAliases,
            includeCategoryJoin: false,
            withCityFilter: true,
        });

        data = simpleQuery.data;
        error = simpleQuery.error;
    }

    if (error) throw error;

    // Intento 3: si no hay resultados para ciudad, devolver reportes recientes globales
    if (!data || data.length === 0) {
        const fallbackQuery = await queryRecentReports({
            cityAliases,
            includeCategoryJoin: false,
            withCityFilter: false,
        });

        if (fallbackQuery.error) throw fallbackQuery.error;
        return fallbackQuery.data || [];
    }

    return data;
}

export async function submitReport(reportData) {
    const { data, error } = await supabase
        .from("price_reports")
        .insert([reportData])
        .select();
    if (error) throw error;
    return data;
}

export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getProductById(id, city) {
    const cityCode = normalizeCityCode(city);
    const cityAliases = getCityAliases(cityCode);

    const { data: product, error: pError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
    if (pError) throw pError;

    const { data: reports, error: rError } = await supabase
        .from("price_reports")
        .select(
            `
            id, price, created_at, user_id,
            markets!inner (id, name, city)
        `,
        )
        .eq("product_id", id)
        .in("markets.city", cityAliases)
        .order("created_at", { ascending: false });

    if (rError) throw rError;

    return { product, reports: reports || [] };
}

export async function getMarketById(id) {
    const { data: market, error: mError } = await supabase
        .from("markets")
        .select("*")
        .eq("id", id)
        .single();
    if (mError) throw mError;

    const { data: reports, error: rError } = await supabase
        .from("price_reports")
        .select(
            `
            id, price, created_at, user_id,
            products!inner(id, name, unit)
        `,
        )
        .eq("market_id", id)
        .order("created_at", { ascending: false });

    if (rError) throw rError;

    return { market, reports: reports || [] };
}

export async function getVoteSummaryByReportIds(reportIds) {
    const normalizedIds = (reportIds || [])
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id));

    if (normalizedIds.length === 0) return {};

    const { data, error } = await supabase
        .from("votes")
        .select("id, report_id, user_id, is_upvote, created_at")
        .in("report_id", normalizedIds)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

    if (error) throw error;

    const summary = {};
    normalizedIds.forEach((id) => {
        summary[id] = { trueVotes: 0, falseVotes: 0 };
    });

    // Recuento por usuario: se considera solo el voto mas reciente por (reporte, usuario).
    const seenUserVoteByReport = new Set();

    (data || []).forEach((vote) => {
        const reportId = Number(vote.report_id);
        const userId = String(vote.user_id || "");
        const uniqueVoteKey = `${reportId}:${userId}`;

        if (seenUserVoteByReport.has(uniqueVoteKey)) {
            return;
        }

        seenUserVoteByReport.add(uniqueVoteKey);

        if (!summary[reportId]) {
            summary[reportId] = { trueVotes: 0, falseVotes: 0 };
        }

        if (vote.is_upvote) {
            summary[reportId].trueVotes += 1;
        } else {
            summary[reportId].falseVotes += 1;
        }
    });

    return summary;
}

export async function registerVote(reportId, userId, isUpvote) {
    const normalizedReportId = Number(reportId);

    const { data: existingVotes, error: existingError } = await supabase
        .from("votes")
        .select("id, is_upvote")
        .eq("report_id", normalizedReportId)
        .eq("user_id", userId)
        .order("id", { ascending: true });

    if (existingError) throw existingError;

    const existingVote = existingVotes?.[0] || null;

    if (existingVote) {
        if (existingVotes.length > 1) {
            const duplicatedIds = existingVotes
                .slice(1)
                .map((vote) => vote.id)
                .filter((id) => Number.isFinite(Number(id)));

            if (duplicatedIds.length > 0) {
                const { error: cleanupError } = await supabase
                    .from("votes")
                    .delete()
                    .in("id", duplicatedIds);

                if (cleanupError) throw cleanupError;
            }
        }

        if (existingVote.is_upvote === isUpvote) {
            return {
                previousVote: existingVote.is_upvote,
                currentVote: isUpvote,
                changed: false,
            };
        }

        const { error: updateError } = await supabase
            .from("votes")
            .update({ is_upvote: isUpvote })
            .eq("id", existingVote.id);

        if (updateError) throw updateError;

        return {
            previousVote: existingVote.is_upvote,
            currentVote: isUpvote,
            changed: true,
        };
    }

    const { error: insertError } = await supabase.from("votes").insert([
        {
            report_id: normalizedReportId,
            user_id: userId,
            is_upvote: isUpvote,
        },
    ]);

    if (insertError) throw insertError;

    return { previousVote: null, currentVote: isUpvote, changed: true };
}

export async function getFavoriteProductIds(userId) {
    const { data, error } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", userId);

    if (error) throw error;
    return (data || []).map((item) => item.product_id);
}

export async function addFavorite(userId, productId) {
    const normalizedProductId = Number(productId);

    const { data: existing, error: existingError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", normalizedProductId)
        .limit(1);

    if (existingError) throw existingError;
    if (existing && existing.length > 0) return existing[0];

    const { data, error } = await supabase
        .from("favorites")
        .insert([{ user_id: userId, product_id: normalizedProductId }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function removeFavorite(userId, productId) {
    const normalizedProductId = Number(productId);

    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", normalizedProductId);

    if (error) throw error;
}

export async function getFavoritesByUser(userId, city) {
    const cityCode = normalizeCityCode(city);
    const cityAliases = getCityAliases(cityCode);

    const { data: favorites, error: favoritesError } = await supabase
        .from("favorites")
        .select("id, product_id, products!inner(id, name, unit, image_url)")
        .eq("user_id", userId)
        .order("id", { ascending: false });

    if (favoritesError) throw favoritesError;
    if (!favorites || favorites.length === 0) return [];

    const productIds = favorites.map((item) => item.product_id);

    const { data: reports, error: reportsError } = await supabase
        .from("price_reports")
        .select(
            `
            id, product_id, price, created_at,
            markets!inner(id, name, city)
        `,
        )
        .in("product_id", productIds)
        .in("markets.city", cityAliases)
        .order("created_at", { ascending: false });

    if (reportsError) throw reportsError;

    const latestByProductId = {};
    (reports || []).forEach((report) => {
        if (!latestByProductId[report.product_id]) {
            latestByProductId[report.product_id] = report;
        }
    });

    return favorites.map((favorite) => ({
        favorite_id: favorite.id,
        product_id: favorite.product_id,
        product: favorite.products,
        latest_report: latestByProductId[favorite.product_id] || null,
    }));
}

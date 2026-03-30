import { supabase } from "./supabaseClient";
import { getCityAliases, normalizeCityCode } from "../utils/city";

const DEFAULT_RECENT_REPORTS_LIMIT = 120;

async function queryRecentReports({
    cityAliases,
    includeCategoryJoin,
    withCityFilter,
    offset = 0,
    limit = DEFAULT_RECENT_REPORTS_LIMIT,
}) {
    const normalizedOffset = Number.isFinite(offset)
        ? Math.max(0, Math.floor(offset))
        : 0;
    const normalizedLimit = Number.isFinite(limit)
        ? Math.max(1, Math.floor(limit))
        : DEFAULT_RECENT_REPORTS_LIMIT;

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
        .select(baseSelect, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(normalizedOffset, normalizedOffset + normalizedLimit - 1);

    if (withCityFilter) {
        query = query.in("markets.city", cityAliases);
    }

    const { data, error, count } = await query;
    return { data, error, count };
}

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
    if (error) throw error;
    return data;
}

export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

    if (error) throw error;
    return data || [];
}

export async function createProduct({ name, unit, categoryId, imageUrl }) {
    const normalizedName = String(name || "").trim();
    const normalizedUnit = String(unit || "unidad").trim();
    const normalizedCategoryId = Number(categoryId);

    if (!normalizedName) {
        throw new Error("El nombre del producto es obligatorio.");
    }

    if (!Number.isFinite(normalizedCategoryId)) {
        throw new Error("Debes seleccionar una categoría válida.");
    }

    const { data, error } = await supabase
        .from("products")
        .insert([
            {
                name: normalizedName,
                unit: normalizedUnit || "unidad",
                category_id: normalizedCategoryId,
                image_url: imageUrl || null,
            },
        ])
        .select("id, name, unit, image_url, category_id")
        .single();

    if (error) throw error;
    return data;
}

export async function createMarket({ name, location, city }) {
    const normalizedName = String(name || "").trim();
    const normalizedLocation = String(location || "").trim();
    const normalizedCity = normalizeCityCode(city);

    if (!normalizedName) {
        throw new Error("El nombre del mercado es obligatorio.");
    }

    const { data, error } = await supabase
        .from("markets")
        .insert([
            {
                name: normalizedName,
                location: normalizedLocation || null,
                city: normalizedCity,
            },
        ])
        .select("id, name, location, city")
        .single();

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

export async function getRecentReports(city, options = {}) {
    const {
        offset = 0,
        limit = DEFAULT_RECENT_REPORTS_LIMIT,
        withMeta = false,
    } = options;

    const normalizedOffset = Number.isFinite(offset)
        ? Math.max(0, Math.floor(offset))
        : 0;
    const normalizedLimit = Number.isFinite(limit)
        ? Math.max(1, Math.floor(limit))
        : DEFAULT_RECENT_REPORTS_LIMIT;

    const cityCode = normalizeCityCode(city);
    const cityAliases = getCityAliases(cityCode);
    let usedGlobalFallback = false;

    let result = await queryRecentReports({
        cityAliases,
        includeCategoryJoin: true,
        withCityFilter: true,
        offset: normalizedOffset,
        limit: normalizedLimit,
    });

    if (result.error) {
        result = await queryRecentReports({
            cityAliases,
            includeCategoryJoin: false,
            withCityFilter: true,
            offset: normalizedOffset,
            limit: normalizedLimit,
        });
    }

    if (result.error) throw result.error;

    if (!result.data || result.data.length === 0) {
        usedGlobalFallback = true;
        result = await queryRecentReports({
            cityAliases,
            includeCategoryJoin: false,
            withCityFilter: false,
            offset: normalizedOffset,
            limit: normalizedLimit,
        });
    }

    if (result.error) throw result.error;

    const reports = result.data || [];
    const totalCount = Number.isFinite(result.count) ? result.count : null;
    const nextOffset = normalizedOffset + reports.length;
    const hasMore =
        totalCount === null
            ? reports.length === normalizedLimit
            : nextOffset < totalCount;

    if (withMeta) {
        return {
            data: reports,
            hasMore,
            nextOffset,
            totalCount,
            usedGlobalFallback,
        };
    }

    return reports;
}

export async function submitReport(reportData) {
    const { data, error } = await supabase
        .from("price_reports")
        .insert([reportData])
        .select();
    if (error) throw error;
    return data;
}

export async function getReportCountByUser(userId) {
    if (!userId) return 0;

    const { count, error } = await supabase
        .from("price_reports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) throw error;
    const parsedCount = Number(count);
    if (Number.isFinite(parsedCount)) return parsedCount;

    let total = 0;
    let offset = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error: fallbackError } = await supabase
            .from("price_reports")
            .select("id")
            .eq("user_id", userId)
            .range(offset, offset + pageSize - 1);

        if (fallbackError) throw fallbackError;

        const currentBatch = Array.isArray(data) ? data.length : 0;
        total += currentBatch;

        if (currentBatch < pageSize) break;
        offset += pageSize;
    }

    return total;
}

export async function getReportsByUser(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from("price_reports")
        .select(
            `
            id, price, created_at, reported_at,
            products!inner(id, name, unit),
            markets!inner(id, name)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteReportById(reportId, userId) {
    const normalizedReportId = Number(reportId);
    if (!Number.isFinite(normalizedReportId)) {
        throw new Error("Id de reporte inválido.");
    }

    let query = supabase
        .from("price_reports")
        .delete()
        .eq("id", normalizedReportId);

    if (userId) {
        query = query.eq("user_id", userId);
    }

    const { error } = await query;
    if (error) throw error;
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

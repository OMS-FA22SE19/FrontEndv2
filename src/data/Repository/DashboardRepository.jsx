import { GetCustomerStatistic, GetFoodStatistic, GetMonthlyOrdersReservations, GetRoyalCustomers, GetTrendingFood } from "../DataSource/DashboardDataSource";

export async function GetCustomers() {
    return await GetCustomerStatistic();
}

export async function GetFoods() {
    return await GetFoodStatistic();
}

export async function GetOrdersReservations() {
    return await GetMonthlyOrdersReservations();
}

export async function GetRoyalCustomersStatistic() {
    return await GetRoyalCustomers();
}

export async function GetTopFood() {
    return await GetTrendingFood();
}